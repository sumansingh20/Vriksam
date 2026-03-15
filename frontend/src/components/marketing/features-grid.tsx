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
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Features data                                                             */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: Brain,
    title: 'Plant Health AI',
    description:
      'Advanced disease detection and health predictions powered by computer vision. Identify issues days before they become visible to the naked eye.',
    gradient: 'from-emerald-500 to-green-500',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description:
      'IoT sensor integration for continuous soil moisture, light, temperature, and humidity tracking. Get instant alerts when conditions change.',
    gradient: 'from-green-500 to-teal-500',
    bgGlow: 'bg-green-500/10',
  },
  {
    icon: CalendarClock,
    title: 'Smart Scheduling',
    description:
      'Automated maintenance routing that optimizes team workflows. AI-driven schedules that adapt to weather, plant health, and team availability.',
    gradient: 'from-teal-500 to-emerald-500',
    bgGlow: 'bg-teal-500/10',
  },
  {
    icon: BarChart3,
    title: 'ESG Analytics',
    description:
      'Comprehensive environmental impact reporting. Track carbon absorption, air quality improvement, and generate audit-ready ESG compliance reports.',
    gradient: 'from-emerald-600 to-green-500',
    bgGlow: 'bg-emerald-600/10',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description:
      'Complete plant lifecycle tracking from procurement to retirement. Monitor inventory, costs, replacements, and supplier performance in one place.',
    gradient: 'from-green-600 to-teal-500',
    bgGlow: 'bg-green-600/10',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Assign tasks, track progress, and manage maintenance teams with ease. Real-time coordination with mobile apps for field teams.',
    gradient: 'from-teal-600 to-emerald-500',
    bgGlow: 'bg-teal-600/10',
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl p-6',
          'border border-white/60 bg-white/40 backdrop-blur-xl',
          'shadow-md shadow-black/[0.02]',
          'transition-all duration-500',
          'hover:border-emerald-200/80 hover:bg-white/70',
          'hover:shadow-lg hover:shadow-emerald-500/[0.06]',
          'hover:-translate-y-1',
        )}
      >
        {/* Hover glow */}
        <div
          className={cn(
            'absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl',
            'opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            feature.bgGlow,
          )}
        />

        {/* Icon */}
        <div className="relative mb-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              'bg-gradient-to-br',
              feature.gradient,
              'shadow-md transition-transform duration-300 group-hover:scale-110',
            )}
          >
            <feature.icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="relative mb-2 text-lg font-bold text-gray-900">
          {feature.title}
        </h3>
        <p className="relative text-sm leading-relaxed text-gray-600">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features Grid                                                             */
/* -------------------------------------------------------------------------- */

export function FeaturesGrid() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

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
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Everything you{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              need
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            A complete platform for managing green infrastructure at scale, from
            AI-powered health monitoring to ESG compliance reporting.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
