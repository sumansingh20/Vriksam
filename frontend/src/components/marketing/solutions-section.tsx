'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  ShoppingBag,
  TreePine,
  Check,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Solutions data                                                            */
/* -------------------------------------------------------------------------- */

const solutions = [
  {
    id: 'corporate',
    icon: Building2,
    tab: 'Corporate',
    title: 'Transform your workspace into a biophilic environment',
    description:
      'Full-floor greenery management that boosts employee productivity by up to 15%. Create spaces that attract and retain top talent with living walls, curated desk plants, and air-quality-optimized selections.',
    features: [
      'Desk & lobby plant design',
      'Living walls & vertical gardens',
      'Air quality optimization',
      'Wellness-focused curation',
    ],
    metric: { value: '40%', label: 'boost in employee satisfaction' },
  },
  {
    id: 'residential',
    icon: Home,
    tab: 'Residential',
    title: 'Curated green living, zero effort',
    description:
      'Balcony and indoor garden management for apartments and gated communities. Enjoy vibrant, professionally maintained greenery without touching a watering can.',
    features: [
      'Balcony garden design',
      'Indoor plant subscriptions',
      'Seasonal refreshes',
      'Pest & disease management',
    ],
    metric: { value: '3x', label: 'plant survival rate vs. self-care' },
  },
  {
    id: 'retail',
    icon: ShoppingBag,
    tab: 'Hospitality',
    title: 'Living spaces that elevate brand experience',
    description:
      'Customer-facing green design that turns commercial spaces into Instagram-worthy destinations. Seasonal themes, event greenery, and brand-aligned botanical curation.',
    features: [
      'Brand-aligned plant design',
      'Seasonal themed arrangements',
      'Event & pop-up greenery',
      'Fragrance-focused selection',
    ],
    metric: { value: '28%', label: 'increase in foot traffic' },
  },
  {
    id: 'urban',
    icon: TreePine,
    tab: 'Municipal',
    title: 'Data-driven urban forestry at scale',
    description:
      'Public space greenery for municipalities and developers. Manage streetscapes, parks, and urban forests with IoT-enabled monitoring and predictive maintenance.',
    features: [
      'Streetscape management',
      'Park maintenance workflows',
      'Tree health monitoring',
      'Biodiversity tracking',
    ],
    metric: { value: '60%', label: 'reduction in maintenance costs' },
  },
];

/* -------------------------------------------------------------------------- */
/*  SolutionsSection — tabbed interface with visual detail panel              */
/* -------------------------------------------------------------------------- */

export function SolutionsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });
  const active = solutions[activeIdx]!;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Solutions
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Built for every type
            <br />
            of green space
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {solutions.map((sol, i) => (
            <button
              key={sol.id}
              onClick={() => setActiveIdx(i)}
              className={cn(
                'relative flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200',
                activeIdx === i
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {activeIdx === i && (
                <motion.div
                  layoutId="solutions-tab-bg"
                  className="absolute inset-0 rounded-full bg-gray-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <sol.icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{sol.tab}</span>
            </button>
          ))}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            {/* Visual placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/80">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-900">
                  <active.icon className="h-10 w-10 text-white" />
                </div>
                {/* Metric highlight */}
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {active.metric.value}
                  </span>
                  <p className="mt-1 text-sm text-gray-500">
                    {active.metric.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {active.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                {active.description}
              </p>

              <ul className="mt-6 space-y-3">
                {active.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-emerald-600"
              >
                Get a proposal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
