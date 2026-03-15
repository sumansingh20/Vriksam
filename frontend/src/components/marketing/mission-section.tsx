'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Leaf, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Feature data                                                              */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: Brain,
    title: 'Smart Monitoring',
    description:
      'AI-powered plant health tracking that detects issues before they become problems. Our computer vision system analyzes leaf patterns, soil moisture, and growth rates in real time.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    icon: Leaf,
    title: 'Sustainable Impact',
    description:
      'Measurable environmental benefits you can report. Track CO2 absorption, air quality improvements, and biodiversity scores with verified ESG-ready metrics.',
    gradient: 'from-green-500 to-emerald-500',
    bgGlow: 'bg-green-500/10',
  },
  {
    icon: Users,
    title: 'Expert Care',
    description:
      'Professional maintenance teams trained in urban horticulture. Scheduled visits, emergency response, and seasonal care programs tailored to your green assets.',
    gradient: 'from-teal-500 to-green-500',
    bgGlow: 'bg-teal-500/10',
  },
];

/* -------------------------------------------------------------------------- */
/*  Card component                                                            */
/* -------------------------------------------------------------------------- */

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl p-8',
          'border border-white/60 bg-white/40 backdrop-blur-xl',
          'shadow-lg shadow-emerald-500/[0.03]',
          'transition-all duration-500',
          'hover:border-emerald-200/80 hover:bg-white/70',
          'hover:shadow-xl hover:shadow-emerald-500/[0.08]',
          'hover:-translate-y-1',
        )}
      >
        {/* Hover glow */}
        <div
          className={cn(
            'absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl',
            'opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            feature.bgGlow,
          )}
        />

        {/* Icon */}
        <div className="relative mb-6">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl',
              'bg-gradient-to-br',
              feature.gradient,
              'shadow-lg',
            )}
          >
            <feature.icon className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Text */}
        <h3 className="relative mb-3 text-xl font-bold text-gray-900">
          {feature.title}
        </h3>
        <p className="relative text-base leading-relaxed text-gray-600">
          {feature.description}
        </p>

        {/* Bottom accent bar */}
        <div
          className={cn(
            'mt-6 h-1 w-12 rounded-full bg-gradient-to-r',
            feature.gradient,
            'opacity-40 transition-all duration-500',
            'group-hover:w-20 group-hover:opacity-100',
          )}
        />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mission Section                                                           */
/* -------------------------------------------------------------------------- */

export function MissionSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

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
            Our Mission
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Making cities{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              greener
            </span>
            , one space at a time
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            We believe every urban space deserves thriving greenery. Our technology
            and expert teams work together to transform concrete landscapes into
            living, breathing ecosystems that benefit people and the planet.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
