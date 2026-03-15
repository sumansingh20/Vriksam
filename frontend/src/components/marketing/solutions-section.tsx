'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Building2,
  Home,
  ShoppingBag,
  TreePine,
  ArrowRight,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Solutions data                                                            */
/* -------------------------------------------------------------------------- */

const solutions = [
  {
    icon: Building2,
    title: 'Corporate Offices',
    description:
      'Full floor greenery management that boosts employee productivity and wellness. Create biophilic workspaces that attract and retain top talent.',
    features: [
      'Desk & partition plants',
      'Living walls & lobby installations',
      'Air quality optimization',
      'Wellness-focused plant selection',
    ],
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-500',
    bgImage: 'from-emerald-100/50 to-emerald-50/30',
  },
  {
    icon: Home,
    title: 'Residential Spaces',
    description:
      'Balcony and indoor garden management for apartments and gated communities. Enjoy curated green spaces without the maintenance hassle.',
    features: [
      'Balcony garden design',
      'Indoor plant subscriptions',
      'Seasonal refresh programs',
      'Pest management',
    ],
    color: 'green',
    gradient: 'from-green-500 to-teal-500',
    bgImage: 'from-green-100/50 to-green-50/30',
  },
  {
    icon: ShoppingBag,
    title: 'Retail & Hospitality',
    description:
      'Customer-facing green design that enhances brand experience. Turn your spaces into Instagram-worthy destinations with living decor.',
    features: [
      'Brand-aligned plant design',
      'Seasonal themed arrangements',
      'Event & pop-up greenery',
      'Fragrance-focused selection',
    ],
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-500',
    bgImage: 'from-teal-100/50 to-teal-50/30',
  },
  {
    icon: TreePine,
    title: 'Urban Infrastructure',
    description:
      'Public space greenery management for municipalities and developers. Build greener cities with data-driven urban forestry solutions.',
    features: [
      'Streetscape management',
      'Park & garden maintenance',
      'Tree health monitoring',
      'Biodiversity tracking',
    ],
    color: 'forest',
    gradient: 'from-forest-500 to-emerald-500',
    bgImage: 'from-forest-100/50 to-emerald-50/30',
  },
];

/* -------------------------------------------------------------------------- */
/*  Solution card                                                             */
/* -------------------------------------------------------------------------- */

function SolutionCard({
  solution,
  index: _index,
  reversed,
}: {
  solution: (typeof solutions)[number];
  index: number;
  reversed: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'grid items-center gap-8 lg:grid-cols-2 lg:gap-16',
        reversed && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {/* Image placeholder */}
      <div className="relative">
        <div
          className={cn(
            'aspect-[4/3] overflow-hidden rounded-3xl',
            'bg-gradient-to-br',
            solution.bgImage,
            'border border-white/80',
            'shadow-lg shadow-black/[0.03]',
          )}
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
            <div
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-3xl',
                'bg-gradient-to-br',
                solution.gradient,
                'shadow-xl',
              )}
            >
              <solution.icon className="h-10 w-10 text-white" />
            </div>
            <div className="mt-2 h-2 w-24 rounded-full bg-white/50" />
            <div className="h-2 w-32 rounded-full bg-white/30" />
            <div className="h-2 w-20 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Decorative floating element */}
        <div
          className={cn(
            'absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl',
            'bg-gradient-to-br',
            solution.gradient,
            'opacity-10 blur-xl',
          )}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <div
          className={cn(
            'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl',
            'bg-gradient-to-br',
            solution.gradient,
          )}
        >
          <solution.icon className="h-6 w-6 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {solution.title}
        </h3>

        <p className="mt-4 text-base leading-relaxed text-gray-600">
          {solution.description}
        </p>

        <ul className="mt-6 space-y-3">
          {solution.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                'bg-gradient-to-br',
                solution.gradient,
              )}>
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <motion.a
          href="#"
          whileHover={{ x: 4 }}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
        >
          Learn More
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Solutions Section                                                         */
/* -------------------------------------------------------------------------- */

export function SolutionsSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Solutions
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Solutions for{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              every space
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            From corporate offices to city parks, we have the technology and expertise
            to manage greenery at any scale.
          </p>
        </motion.div>

        {/* Solution cards */}
        <div className="mt-20 flex flex-col gap-24">
          {solutions.map((solution, i) => (
            <SolutionCard
              key={solution.title}
              solution={solution}
              index={i}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
