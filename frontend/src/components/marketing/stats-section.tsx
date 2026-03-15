'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Stats data                                                                */
/* -------------------------------------------------------------------------- */

const stats = [
  { value: 10000, suffix: '+', label: 'Plants managed' },
  { value: 500, suffix: '+', label: 'Corporate clients' },
  { value: 50, suffix: '+', label: 'Cities served' },
  { value: 2, suffix: 'M+', label: 'kg CO₂ offset' },
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1"
    >
      <span className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-gray-900">
        {formatted}
        <span className="text-emerald-600">{stat.suffix}</span>
      </span>
      <span className="text-sm font-medium text-gray-500">{stat.label}</span>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats Section — clean, light, Apple-style                                 */
/* -------------------------------------------------------------------------- */

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className={cn(
          'grid grid-cols-2 gap-y-10 gap-x-4',
          'md:grid-cols-4 md:gap-x-8',
        )}>
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
