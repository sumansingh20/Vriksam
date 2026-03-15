'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Leaf, Shield, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Bento data — asymmetric grid, each cell a different visual treatment      */
/* -------------------------------------------------------------------------- */

const pillars = [
  {
    icon: Brain,
    title: 'AI-Powered Plant Intelligence',
    description:
      'Computer vision analyzes leaf patterns, soil moisture, and growth rates in real time — detecting issues days before they become visible.',
    accent: 'emerald',
    span: 'col-span-1 lg:col-span-2', // wide
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Reliability',
    description:
      'SOC 2 compliant infrastructure. 99.99% uptime with real-time failover, end-to-end encryption, and dedicated support.',
    accent: 'gray',
    span: 'col-span-1', // narrow
  },
  {
    icon: Leaf,
    title: 'Measurable Sustainability',
    description:
      'Track CO₂ absorption, air quality improvements, and biodiversity scores with audit-ready, ESG-compliant reporting your board can trust.',
    accent: 'green',
    span: 'col-span-1', // narrow
  },
];

/* -------------------------------------------------------------------------- */
/*  MissionSection — asymmetric bento layout with brand copy                  */
/* -------------------------------------------------------------------------- */

export function MissionSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden bg-gray-50/60 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header — left-aligned for editorial feel */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Why Vriksham
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Technology that makes
            <br />
            green spaces thrive
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            We combine AI, IoT, and horticulture expertise to manage urban greenery at any
            scale — from a single office floor to an entire city.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => {
            const isWide = pillar.span.includes('col-span-2');
            return (
              <BentoCard key={pillar.title} pillar={pillar} index={i} isWide={isWide} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  BentoCard                                                                 */
/* -------------------------------------------------------------------------- */

function BentoCard({
  pillar,
  index,
  isWide,
}: {
  pillar: (typeof pillars)[number];
  index: number;
  isWide: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        pillar.span,
        'group relative',
      )}
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl p-8',
          'bg-white border border-gray-200/80',
          'shadow-sm',
          'transition-all duration-400',
          'hover:shadow-lg hover:shadow-black/[0.04]',
          'hover:border-gray-300/80',
          isWide && 'sm:p-10',
        )}
      >
        {/* Icon */}
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900">
          <pillar.icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900">{pillar.title}</h3>
        <p className={cn(
          'mt-2.5 text-[15px] leading-relaxed text-gray-500',
          isWide ? 'max-w-md' : 'max-w-sm',
        )}>
          {pillar.description}
        </p>

        {/* Hover arrow */}
        <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-900">
          Learn more
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
