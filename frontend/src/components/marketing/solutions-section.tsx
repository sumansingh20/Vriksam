'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  ShoppingBag,
  TreePine,
  Check,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import { cardLift, buttonPress } from '@/animations/micro-interactions';

/* -------------------------------------------------------------------------- */
/*  Premium Solutions data with real images                                  */
/* -------------------------------------------------------------------------- */

const solutions = [
  {
    id: 'corporate',
    icon: Building2,
    tab: 'Corporate',
    title: 'Workspaces that inspire productivity',
    subtitle: 'Biophilic office environments',
    description:
      'Transform sterile offices into vibrant ecosystems. Our corporate greenery solutions have been proven to boost employee satisfaction by 40% and productivity by 15%.',
    longDescription: 'Every great company understands that happy employees are productive employees. Our biophilic office designs don\'t just add plants—they create environments where people thrive.',
    features: [
      'Living walls & vertical gardens',
      'Air-purifying desk plants',
      'Wellness-focused curation',
      'Maintenance-free solutions',
    ],
    metric: { value: '40%', label: 'boost in employee satisfaction', icon: Users },
    image: IMAGES.solutions.corporate,
    accent: 'from-blue-600 to-blue-500',
    bgGradient: 'from-blue-50/50 to-white',
  },
  {
    id: 'residential',
    icon: Home,
    tab: 'Residential',
    title: 'Green living made effortless',
    subtitle: 'Balcony & indoor gardens',
    description:
      'Enjoy professional-grade greenery in your home without the hassle. Our residential service achieves 3x higher plant survival rates than DIY approaches.',
    longDescription: 'Your home should be your sanctuary. We bring that vision to life with curated plant selections that thrive in your specific space and lighting conditions.',
    features: [
      'Balcony garden design',
      'Seasonal plant rotations',
      'Pet-safe selections',
      'Growth guarantee',
    ],
    metric: { value: '3x', label: 'plant survival rate vs. self-care', icon: TrendingUp },
    image: IMAGES.solutions.residential,
    accent: 'from-emerald-600 to-emerald-500',
    bgGradient: 'from-emerald-50/50 to-white',
  },
  {
    id: 'retail',
    icon: ShoppingBag,
    tab: 'Hospitality',
    title: 'Spaces that customers remember',
    subtitle: 'Brand-aligned green design',
    description:
      'Turn your commercial space into an Instagram-worthy destination. Our hospitality clients see an average 28% increase in foot traffic and customer engagement.',
    longDescription: 'First impressions matter. Create memorable experiences that customers share, return to, and recommend with thoughtfully designed living environments.',
    features: [
      'Brand-aligned aesthetics',
      'Seasonal themed displays',
      'Event & pop-up greenery',
      'Fragrance integration',
    ],
    metric: { value: '28%', label: 'increase in foot traffic', icon: Sparkles },
    image: IMAGES.solutions.retail,
    accent: 'from-purple-600 to-purple-500',
    bgGradient: 'from-purple-50/50 to-white',
  },
  {
    id: 'urban',
    icon: TreePine,
    tab: 'Municipal',
    title: 'Cities designed for the future',
    subtitle: 'Smart urban forestry',
    description:
      'Municipal green infrastructure that scales. Our IoT-enabled monitoring and predictive maintenance reduce costs by 60% while improving urban biodiversity.',
    longDescription: 'Building sustainable cities requires intelligent systems. Our urban forestry platform combines IoT monitoring with expert horticultural knowledge for scalable green infrastructure.',
    features: [
      'IoT sensor networks',
      'Predictive maintenance',
      'Biodiversity tracking',
      'Climate resilience',
    ],
    metric: { value: '60%', label: 'reduction in maintenance costs', icon: Zap },
    image: IMAGES.solutions.coworking, // Using coworking as urban alternative
    accent: 'from-green-600 to-green-500',
    bgGradient: 'from-green-50/50 to-white',
  },
];

/* -------------------------------------------------------------------------- */
/*  Premium Solutions Section                                                 */
/* -------------------------------------------------------------------------- */

export function SolutionsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });
  const active = solutions[activeIdx]!;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Premium background system */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-white" />
      <div className="absolute inset-0 bg-gradient-mesh-warm opacity-40" />

      {/* Animated dot pattern */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_rgba(16,185,129,0.12)_2px,_transparent_0)] bg-[length:48px_48px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Premium Section Header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 32 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass-emerald-premium px-4 py-2 text-sm font-bold uppercase tracking-widest text-emerald-700">
            <Building2 className="h-4 w-4" />
            Solutions
          </div>

          <h2 className="mt-8 text-display-lg lg:text-display-xl font-extrabold tracking-tight text-gray-900 font-heading">
            Every space.
            <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              Every need.
            </span>
          </h2>

          <p className="mt-6 text-xl leading-relaxed text-gray-600">
            From corporate offices to residential balconies, we create thriving green environments tailored to your unique space and goals.
          </p>
        </motion.div>

        {/* Premium Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16"
        >
          <div className="glass-premium rounded-2xl p-2 shadow-premium-md">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {solutions.map((sol, i) => (
                <motion.button
                  key={sol.id}
                  onClick={() => setActiveIdx(i)}
                  variants={buttonPress}
                  initial="rest"
                  whileHover="hover"
                  whileTap="pressed"
                  className={cn(
                    'relative flex items-center gap-3 whitespace-nowrap rounded-xl px-6 py-4 text-sm font-bold transition-all duration-300',
                    'min-w-[140px] justify-center',
                    activeIdx === i
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  {activeIdx === i && (
                    <motion.div
                      layoutId="solutions-tab-bg"
                      className="absolute inset-0 rounded-xl bg-white shadow-premium ring-1 ring-gray-200/50"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <sol.icon className={cn(
                    "relative z-10 h-5 w-5 transition-colors duration-300",
                    activeIdx === i
                      ? "text-emerald-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  <span className="relative z-10 font-heading">{sol.tab}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Premium Content Panel */}
        <div className="mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
            >
              {/* Premium Visual Panel */}
              <motion.div
                variants={cardLift}
                initial="rest"
                whileHover="hover"
                className="group relative aspect-[5/4] overflow-hidden rounded-3xl"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
                  {/* Accent color overlay */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-t opacity-10 group-hover:opacity-20 transition-opacity duration-500',
                    active.accent
                  )} />
                </div>

                {/* Floating Metric Card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="glass-premium rounded-2xl p-6 shadow-premium-lg ring-1 ring-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg',
                        `bg-gradient-to-br ${active.accent}`
                      )}>
                        <active.metric.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900 font-heading">
                          {active.metric.value}
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                          {active.metric.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-700"
                  >
                    <active.icon className="h-3 w-3" />
                    {active.subtitle}
                  </motion.div>
                </div>

                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </motion.div>

              {/* Premium Content Panel */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-display-md font-bold tracking-tight text-gray-900 font-heading"
                  >
                    {active.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg leading-relaxed text-gray-600"
                  >
                    {active.longDescription}
                  </motion.p>
                </div>

                {/* Features List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-4"
                >
                  {active.features.map((feature, idx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                        `bg-gradient-to-br ${active.accent} shadow-sm`
                      )}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Link href="/contact">
                    <motion.button
                      variants={buttonPress}
                      initial="rest"
                      whileHover="hover"
                      whileTap="pressed"
                      className={cn(
                        'group inline-flex items-center gap-3 rounded-full px-8 py-4',
                        'bg-gradient-to-r text-white font-bold shadow-lg',
                        'transition-all duration-300',
                        active.accent,
                        'hover:shadow-xl'
                      )}
                    >
                      <span>Get a custom proposal</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}