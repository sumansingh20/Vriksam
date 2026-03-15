'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { TreePine, Users, MapPin, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Stats data                                                                */
/* -------------------------------------------------------------------------- */

const stats = [
  {
    icon: TreePine,
    value: 10000,
    suffix: '+',
    label: 'Plants Managed',
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Happy Clients',
  },
  {
    icon: MapPin,
    value: 50,
    suffix: '+',
    label: 'Cities Covered',
  },
  {
    icon: Wind,
    value: 2,
    suffix: 'M+',
    label: 'kg CO\u2082 Absorbed',
  },
];

/* -------------------------------------------------------------------------- */
/*  CountUp hook                                                              */
/* -------------------------------------------------------------------------- */

function useCountUp(end: number, start = 0, duration = 2000, enabled = false) {
  const [count, setCount] = useState(start);

  const animate = useCallback(() => {
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a pleasant deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [end, start, duration]);

  useEffect(() => {
    if (enabled) {
      animate();
    }
  }, [enabled, animate]);

  return count;
}

/* -------------------------------------------------------------------------- */
/*  Stat card                                                                 */
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
  const count = useCountUp(stat.value, 0, 2200, isInView);

  const formatted = stat.value >= 1000
    ? new Intl.NumberFormat('en-IN').format(count)
    : count.toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'flex flex-col items-center gap-3 text-center',
        index < stats.length - 1 && 'md:border-r md:border-white/10',
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
        <stat.icon className="h-6 w-6 text-emerald-300" />
      </div>
      <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {formatted}
        <span className="text-emerald-300">{stat.suffix}</span>
      </div>
      <p className="text-sm font-medium text-emerald-200/70">{stat.label}</p>
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
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-24">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
