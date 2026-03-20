'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sprout, Building2, MapPin, Wind, TrendingUp, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Stats data                                                                */
/* -------------------------------------------------------------------------- */

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Plants Managed',
    description: 'Active green assets monitored daily',
    icon: Sprout,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Corporate Clients',
    description: 'Organizations trust Vriksham',
    icon: Building2,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Cities Served',
    description: 'Across India and growing',
    icon: MapPin,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    value: 2,
    suffix: 'M+',
    label: 'kg CO₂ Offset',
    description: 'Environmental impact tracked',
    icon: Wind,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
  },
];

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'ring-emerald-100',
    glow: 'shadow-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-100',
    glow: 'shadow-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    ring: 'ring-purple-100',
    glow: 'shadow-purple-500/20',
  },
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    ring: 'ring-teal-100',
    glow: 'shadow-teal-500/20',
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Animated counter hook                                                     */
/* -------------------------------------------------------------------------- */

function useCountUp(end: number, duration = 2500, enabled = false) {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    const startTime = performance.now();
    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
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
/*  Premium Stat Card                                                         */
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
  const count = useCountUp(stat.value, 2500, isInView);
  const formatted =
    stat.value >= 1000
      ? new Intl.NumberFormat('en-IN').format(count)
      : count.toString();

  const Icon = stat.icon;
  const colors = colorMap[stat.color as keyof typeof colorMap] ?? colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className={cn(
        'absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        'bg-gradient-to-r blur-xl',
        stat.gradient,
      )} style={{ opacity: 0.15 }} />

      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative flex flex-col items-center p-8 sm:p-10 rounded-3xl',
          'bg-white/80 backdrop-blur-xl',
          'border border-gray-100/80',
          'hover:border-gray-200 hover:shadow-2xl',
          colors.glow,
          'transition-all duration-500',
        )}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Icon with gradient background */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="relative"
        >
          <div className={cn(
            'flex items-center justify-center w-16 h-16 rounded-2xl mb-6',
            'bg-gradient-to-br',
            stat.gradient,
            'shadow-lg',
            colors.glow,
          )}>
            <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={cn(
              'absolute inset-0 rounded-2xl',
              'bg-gradient-to-br',
              stat.gradient,
            )}
            style={{ opacity: 0.2 }}
          />
        </motion.div>

        {/* Value with animated number */}
        <div className="flex items-baseline gap-1 relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.12 + 0.3, duration: 0.5 }}
            className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-gray-900"
          >
            {formatted}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.12 + 0.5, duration: 0.4 }}
            className={cn('text-3xl sm:text-4xl font-bold', colors.text)}
          >
            {stat.suffix}
          </motion.span>

          {/* Sparkle effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 1, 0] } : {}}
            transition={{ delay: index * 0.12 + 0.8, duration: 1 }}
            className="absolute -top-2 -right-2"
          >
            <TrendingUp className={cn('w-5 h-5', colors.text)} />
          </motion.div>
        </div>

        {/* Label */}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {stat.label}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-500 text-center max-w-[180px]">
          {stat.description}
        </p>
      </motion.div>
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
    <section ref={ref} className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            Our Impact
          </motion.span>

          <h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Numbers that{' '}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                speak
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-3 bg-emerald-100/70 -z-0 origin-left rounded-full"
              />
            </span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            From startups to enterprises, we're helping organizations create healthier, greener workspaces across India.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex items-center justify-center gap-3 text-sm text-gray-400"
        >
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span>Growing every day with 100+ new plants added weekly</span>
          <Leaf className="w-4 h-4 text-emerald-400" />
        </motion.div>
      </div>
    </section>
  );
}
