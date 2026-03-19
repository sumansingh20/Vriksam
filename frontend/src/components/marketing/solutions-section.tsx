'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  Hotel,
  TreePine,
  Check,
  ArrowRight,
  Users,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Solutions data                                                            */
/* -------------------------------------------------------------------------- */

const solutions = [
  {
    id: 'corporate',
    icon: Building2,
    label: 'Corporate',
    title: 'Workspaces that inspire',
    subtitle: 'Biophilic office environments that boost productivity',
    description: 'Transform sterile offices into vibrant ecosystems. Our corporate greenery solutions are proven to boost employee satisfaction by 40% and productivity by 15%.',
    features: [
      'Living walls & vertical gardens',
      'Air-purifying desk arrangements',
      'Wellness-focused plant curation',
      'Zero-maintenance solutions',
    ],
    stat: { value: '40%', label: 'boost in satisfaction' },
    statIcon: Users,
    image: IMAGES.solutions.corporate,
    color: 'blue',
  },
  {
    id: 'residential',
    icon: Home,
    label: 'Residential',
    title: 'Green living, effortlessly',
    subtitle: 'Professional plant care for your home',
    description: 'Enjoy professional-grade greenery at home without the hassle. Our residential service achieves 3x higher plant survival rates than DIY approaches.',
    features: [
      'Balcony garden design',
      'Indoor plant styling',
      'Pet-safe selections',
      'Seasonal rotations',
    ],
    stat: { value: '3x', label: 'plant survival rate' },
    statIcon: TrendingUp,
    image: IMAGES.solutions.residential,
    color: 'emerald',
  },
  {
    id: 'hospitality',
    icon: Hotel,
    label: 'Hospitality',
    title: 'Spaces customers remember',
    subtitle: 'Brand-aligned green design for commercial spaces',
    description: 'Turn your commercial space into an Instagram-worthy destination. Our hospitality clients see an average 28% increase in foot traffic.',
    features: [
      'Brand-aligned aesthetics',
      'Seasonal themed displays',
      'Event greenery services',
      'Fragrance integration',
    ],
    stat: { value: '28%', label: 'more foot traffic' },
    statIcon: Sparkles,
    image: IMAGES.solutions.retail,
    color: 'purple',
  },
  {
    id: 'municipal',
    icon: TreePine,
    label: 'Municipal',
    title: 'Cities built for the future',
    subtitle: 'Smart urban forestry at scale',
    description: 'Municipal green infrastructure powered by IoT. Our monitoring and predictive maintenance reduce costs by 60% while improving urban biodiversity.',
    features: [
      'IoT sensor networks',
      'Predictive maintenance',
      'Biodiversity tracking',
      'Climate resilience planning',
    ],
    stat: { value: '60%', label: 'cost reduction' },
    statIcon: Zap,
    image: IMAGES.solutions.coworking,
    color: 'green',
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-500' as const, text: 'text-blue-600' as const, border: 'border-blue-200' as const, light: 'bg-blue-50' as const },
  emerald: { bg: 'bg-emerald-500' as const, text: 'text-emerald-600' as const, border: 'border-emerald-200' as const, light: 'bg-emerald-50' as const },
  purple: { bg: 'bg-purple-500' as const, text: 'text-purple-600' as const, border: 'border-purple-200' as const, light: 'bg-purple-50' as const },
  green: { bg: 'bg-green-500' as const, text: 'text-green-600' as const, border: 'border-green-200' as const, light: 'bg-green-50' as const },
} as const;

/* -------------------------------------------------------------------------- */
/*  Solutions Section                                                         */
/* -------------------------------------------------------------------------- */

export function SolutionsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const active = solutions[activeIdx]!;
  const colors = colorMap[active.color as keyof typeof colorMap] ?? colorMap.emerald;

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
            <Building2 className="w-4 h-4" />
            Solutions
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Every space.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              Every need.
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From corporate offices to residential balconies, we create thriving environments tailored to your unique space.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <div className="inline-flex items-center p-1 rounded-full bg-gray-100">
            {solutions.map((sol, i) => (
              <button
                key={sol.id}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium',
                  'transition-all duration-300',
                  activeIdx === i ? 'text-white' : 'text-gray-600 hover:text-gray-900',
                )}
              >
                {activeIdx === i && (
                  <motion.div
                    layoutId="solutions-tab"
                    className="absolute inset-0 bg-gray-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <sol.icon className="relative z-10 w-4 h-4" />
                <span className="relative z-10 hidden sm:inline">{sol.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content panel */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center"
            >
              {/* Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden group"
              >
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />

                {/* Stat card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="inline-flex items-center gap-4 rounded-2xl bg-white/95 backdrop-blur-sm p-5 shadow-xl"
                  >
                    <div className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-xl',
                      colors.light,
                    )}>
                      <active.statIcon className={cn('w-6 h-6', colors.text)} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 font-display">
                        {active.stat.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {active.stat.label}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Category badge */}
                <div className="absolute top-6 left-6">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                    'bg-white/90 backdrop-blur-sm text-gray-700',
                  )}>
                    <active.icon className="w-3.5 h-3.5" />
                    {active.subtitle}
                  </span>
                </div>
              </motion.div>

              {/* Content */}
              <div className="space-y-8">
                <div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="font-display text-2xl sm:text-3xl font-bold text-gray-900"
                  >
                    {active.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-4 text-lg text-gray-600 leading-relaxed"
                  >
                    {active.description}
                  </motion.p>
                </div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="space-y-3"
                >
                  {active.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className={cn(
                        'flex items-center justify-center w-5 h-5 rounded-full',
                        colors.bg,
                      )}>
                        <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'group inline-flex items-center gap-2.5 rounded-full',
                        'bg-gray-900 hover:bg-gray-800',
                        'px-6 py-3 text-[15px] font-semibold text-white',
                        'shadow-lg shadow-gray-900/20 hover:shadow-xl',
                        'transition-all duration-300',
                      )}
                    >
                      Get a free consultation
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
