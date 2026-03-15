'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Leaf, Shield, ArrowUpRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Bento data                                                                */
/* -------------------------------------------------------------------------- */

const pillars = [
  {
    icon: Brain,
    title: 'AI-Powered Plant Intelligence',
    description:
      'Computer vision analyzes leaf patterns, soil moisture, and growth rates in real time — detecting issues days before they become visible.',
    span: 'col-span-1 lg:col-span-2',
    featured: true,
    iconGradient: 'from-emerald-600 to-teal-600',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Reliability',
    description:
      'SOC 2 compliant infrastructure with 99.99% uptime, real-time failover, and end-to-end encryption.',
    span: 'col-span-1',
    featured: false,
    iconGradient: 'from-gray-700 to-gray-900',
  },
  {
    icon: Leaf,
    title: 'Measurable Sustainability',
    description:
      'Track CO₂ absorption, air quality improvements, and biodiversity scores with audit-ready ESG reports.',
    span: 'col-span-1',
    featured: false,
    iconGradient: 'from-green-600 to-emerald-600',
  },
  {
    icon: Zap,
    title: 'Automated Operations',
    description:
      'Smart scheduling, route optimization, and predictive maintenance — your team does more with less effort.',
    span: 'col-span-1 lg:col-span-2',
    featured: false,
    iconGradient: 'from-amber-500 to-orange-500',
  },
];

/* -------------------------------------------------------------------------- */
/*  Mini SVG illustrations for featured card                                  */
/* -------------------------------------------------------------------------- */

function AIIllustration() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" fill="none">
      {/* Neural network nodes */}
      <circle cx="20" cy="20" r="4" fill="#10b981" opacity={0.6} />
      <circle cx="20" cy="40" r="4" fill="#10b981" opacity={0.4} />
      <circle cx="20" cy="60" r="4" fill="#10b981" opacity={0.5} />
      <circle cx="60" cy="15" r="5" fill="#059669" opacity={0.7} />
      <circle cx="60" cy="40" r="6" fill="#10b981" opacity={0.8} />
      <circle cx="60" cy="65" r="5" fill="#059669" opacity={0.6} />
      <circle cx="100" cy="30" r="4" fill="#34d399" opacity={0.5} />
      <circle cx="100" cy="50" r="4" fill="#34d399" opacity={0.7} />
      {/* Connections */}
      <line x1="24" y1="20" x2="55" y2="15" stroke="#10b981" strokeWidth="1" opacity={0.2} />
      <line x1="24" y1="20" x2="54" y2="40" stroke="#10b981" strokeWidth="1" opacity={0.15} />
      <line x1="24" y1="40" x2="54" y2="40" stroke="#10b981" strokeWidth="1.5" opacity={0.25} />
      <line x1="24" y1="60" x2="55" y2="65" stroke="#10b981" strokeWidth="1" opacity={0.2} />
      <line x1="24" y1="60" x2="54" y2="40" stroke="#10b981" strokeWidth="1" opacity={0.15} />
      <line x1="65" y1="15" x2="96" y2="30" stroke="#059669" strokeWidth="1" opacity={0.2} />
      <line x1="66" y1="40" x2="96" y2="30" stroke="#059669" strokeWidth="1.5" opacity={0.25} />
      <line x1="66" y1="40" x2="96" y2="50" stroke="#059669" strokeWidth="1.5" opacity={0.25} />
      <line x1="65" y1="65" x2="96" y2="50" stroke="#059669" strokeWidth="1" opacity={0.2} />
      {/* Pulse rings on key nodes */}
      <circle cx="60" cy="40" r="10" stroke="#10b981" strokeWidth="1" opacity={0.15} fill="none" />
      <circle cx="60" cy="40" r="16" stroke="#10b981" strokeWidth="0.5" opacity={0.08} fill="none" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  BentoCard                                                                 */
/* -------------------------------------------------------------------------- */

function BentoCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isWide = pillar.span.includes('col-span-2');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={cn(pillar.span, 'group relative')}
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-3xl transition-all duration-300',
          pillar.featured
            ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 p-8 sm:p-10 text-white'
            : 'bg-white border border-gray-200/80 p-8 hover:shadow-[0_8px_40px_rgba(16,185,129,0.08)] hover:border-emerald-200/50',
        )}
      >
        {/* Accent line for non-featured */}
        {!pillar.featured && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        {/* Featured card decorative elements */}
        {pillar.featured && (
          <>
            <div className="absolute top-0 right-0 w-1/2 opacity-30">
              <AIIllustration />
            </div>
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/[0.06] blur-[60px]" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-teal-500/[0.08] blur-[40px]" />
          </>
        )}

        {/* Icon */}
        <div className={cn(
          'relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
          pillar.featured
            ? 'from-emerald-500 to-teal-500 shadow-emerald-500/20'
            : pillar.iconGradient + ' shadow-gray-900/10',
        )}>
          <pillar.icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <h3 className={cn(
          'font-heading text-lg font-bold',
          pillar.featured ? 'text-white' : 'text-gray-900',
        )}>
          {pillar.title}
        </h3>
        <p className={cn(
          'mt-3 text-[15px] leading-relaxed',
          isWide ? 'max-w-md' : 'max-w-sm',
          pillar.featured ? 'text-gray-400' : 'text-gray-500',
        )}>
          {pillar.description}
        </p>

        {/* Hover arrow */}
        <div className={cn(
          'mt-6 flex items-center gap-1.5 text-sm font-medium transition-colors duration-200',
          pillar.featured
            ? 'text-emerald-400 group-hover:text-emerald-300'
            : 'text-gray-400 group-hover:text-emerald-600',
        )}>
          Learn more
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  MissionSection                                                            */
/* -------------------------------------------------------------------------- */

export function MissionSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(16,185,129,0.03),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Why Vriksham
          </span>
          <h2 className="mt-6 font-heading text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Technology that makes{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              green spaces thrive
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            We combine AI, IoT, and horticulture expertise to manage urban greenery at any
            scale — from a single office floor to an entire city.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <BentoCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
