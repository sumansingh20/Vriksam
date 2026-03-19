'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sprout, Building2, MapPin, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Stats data                                                                */
/* -------------------------------------------------------------------------- */

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Plants Managed',
    description: 'Active green assets tracked daily',
    icon: Sprout,
    color: 'emerald',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Corporate Clients',
    description: 'Organizations trust Vriksham',
    icon: Building2,
    color: 'blue',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Cities Served',
    description: 'Across India and growing',
    icon: MapPin,
    color: 'purple',
  },
  {
    value: 2,
    suffix: 'M+',
    label: 'kg CO₂ Offset',
    description: 'Environmental impact tracked',
    icon: Wind,
    color: 'teal',
  },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-50' as const, text: 'text-emerald-600' as const, ring: 'ring-emerald-100' as const },
  blue: { bg: 'bg-blue-50' as const, text: 'text-blue-600' as const, ring: 'ring-blue-100' as const },
  purple: { bg: 'bg-purple-50' as const, text: 'text-purple-600' as const, ring: 'ring-purple-100' as const },
  teal: { bg: 'bg-teal-50' as const, text: 'text-teal-600' as const, ring: 'ring-teal-100' as const },
} as const;

/* -------------------------------------------------------------------------- */
/*  CountUp hook                                                              */
/* -------------------------------------------------------------------------- */

function useCountUp(end: number, duration = 2000, enabled = false) {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    const startTime = performance.now();
    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [end, duration]);

  useEffect(() => {
    if (enabled) animate();
  }, [enabled, animate]);

  return count;
}

/* -------------------------------------------------------------------------- */
/*  Stat Card                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  stat,
  index,
  isInView,
}: {
  stat: (typeof stats)[number];
  index: number;
  isInView: boolean;
}) {
  const count = useCountUp(stat.value, 2000, isInView);
  const formatted =
    stat.value >= 1000
      ? new Intl.NumberFormat('en-IN').format(count)
      : count.toString();

  const Icon = stat.icon;
  const colors = colorMap[stat.color as keyof typeof colorMap] ?? colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div className={cn(
        'relative flex flex-col items-center p-8 rounded-2xl',
        'bg-white border border-gray-100',
        'hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50',
        'transition-all duration-300',
      )}>
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-2xl mb-6',
            'ring-1',
            colors.bg,
            colors.ring,
          )}
        >
          <Icon className={cn('w-6 h-6', colors.text)} strokeWidth={1.5} />
        </motion.div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            {formatted}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-500">
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <h3 className="mt-3 text-base font-semibold text-gray-900">
          {stat.label}
        </h3>

        {/* Description */}
        <p className="mt-1 text-sm text-gray-500 text-center">
          {stat.description}
        </p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats Section                                                             */
/* -------------------------------------------------------------------------- */

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Our Impact
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Numbers that speak for themselves
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From startups to enterprises, we're helping organizations create healthier, greener workspaces.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
