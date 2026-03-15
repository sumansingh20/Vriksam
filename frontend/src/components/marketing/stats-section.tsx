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
    label: 'Plants managed',
    description: 'Active green assets tracked in real-time',
    icon: Sprout,
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Corporate clients',
    description: 'Organizations trusting Vriksham',
    icon: Building2,
    gradient: 'from-green-500 to-emerald-500',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-600',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Cities served',
    description: 'Across India and growing globally',
    icon: MapPin,
    gradient: 'from-teal-500 to-cyan-500',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-600',
  },
  {
    value: 2,
    suffix: 'M+',
    label: 'kg CO₂ offset',
    description: 'Environmental impact since launch',
    icon: Wind,
    gradient: 'from-sky-500 to-blue-500',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-600',
  },
];

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
/*  Stat Item                                                                 */
/* -------------------------------------------------------------------------- */

function StatItem({
  stat,
  index,
  isInView,
}: {
  stat: (typeof stats)[number];
  index: number;
  isInView: boolean;
}) {
  const count = useCountUp(stat.value, 2200, isInView);
  const formatted =
    stat.value >= 1000
      ? new Intl.NumberFormat('en-IN').format(count)
      : count.toString();

  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center gap-4 px-4 py-6"
    >
      {/* Icon */}
      <div className={cn(
        'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
        stat.iconBg
      )}>
        <Icon className={cn('h-6 w-6', stat.iconColor)} />
      </div>

      {/* Number */}
      <div className="flex items-baseline gap-0.5">
        <span className="font-heading text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold tracking-tight text-gray-900">
          {formatted}
        </span>
        <span className={cn(
          'bg-gradient-to-r bg-clip-text text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-transparent',
          stat.gradient
        )}>
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <div className="text-center">
        <span className="text-sm font-semibold text-gray-800">{stat.label}</span>
        <p className="mt-0.5 text-xs text-gray-500">{stat.description}</p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats Section                                                             */
/* -------------------------------------------------------------------------- */

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.03),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Our Impact
          </span>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative">
              <StatItem stat={stat} index={i} isInView={isInView} />
              {/* Vertical divider between stats (desktop only) */}
              {i < stats.length - 1 && (
                <div className="absolute right-0 top-1/4 hidden h-1/2 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div className="mx-auto max-w-5xl px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
    </section>
  );
}
