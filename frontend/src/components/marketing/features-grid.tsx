'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Activity,
  CalendarClock,
  BarChart3,
  Package,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Features data — now with varied sizes for bento layout                    */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: Brain,
    title: 'Plant Health AI',
    description:
      'Disease detection and health predictions via computer vision. Catch problems days before they become visible.',
    size: 'large' as const, // spans 2 cols
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description:
      'IoT sensors track soil moisture, light, temperature, and humidity 24/7.',
    size: 'small' as const,
  },
  {
    icon: CalendarClock,
    title: 'Smart Scheduling',
    description:
      'AI-optimized maintenance routes that adapt to weather, health data, and team availability.',
    size: 'small' as const,
  },
  {
    icon: BarChart3,
    title: 'ESG Analytics',
    description:
      'Audit-ready environmental impact reports. Track carbon absorption and air quality improvements.',
    size: 'small' as const,
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description:
      'Full plant lifecycle tracking — procurement, health, replacements, and supplier performance.',
    size: 'small' as const,
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Task assignment, progress tracking, and real-time coordination with mobile-first field apps.',
    size: 'large' as const, // spans 2 cols
  },
];

/* -------------------------------------------------------------------------- */
/*  Feature card                                                              */
/* -------------------------------------------------------------------------- */

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isLarge = feature.size === 'large';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group relative',
        isLarge ? 'sm:col-span-2' : 'sm:col-span-1',
      )}
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl',
          'bg-white border border-gray-200/80',
          'shadow-sm',
          'transition-all duration-400',
          'hover:shadow-lg hover:shadow-black/[0.04]',
          'hover:border-gray-300/80',
          isLarge ? 'p-8 sm:p-10' : 'p-7',
        )}
      >
        {/* Icon — dark, minimal */}
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900">
          <feature.icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900">
          {feature.title}
        </h3>
        <p className={cn(
          'mt-2 text-[15px] leading-relaxed text-gray-500',
          isLarge ? 'max-w-md' : '',
        )}>
          {feature.description}
        </p>

        {/* Hover arrow */}
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-900">
          Explore
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features Grid — bento layout with varied card sizes                       */
/* -------------------------------------------------------------------------- */

export function FeaturesGrid() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden bg-gray-50/60 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Platform
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Everything you need to manage
            <br className="hidden sm:block" />
            green infrastructure at scale
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            Six integrated modules. One unified platform. Zero complexity.
          </p>
        </motion.div>

        {/* Bento grid — 3 cols on lg, alternating 2+1 / 1+2 pattern */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
