'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface StatItem {
  title: string;
  value: number;
  formattedValue?: string;
  prefix?: string;
  suffix?: string;
  change: number; // percentage, positive = up
  icon: LucideIcon;
  sparklineData?: number[];
  iconColor?: string;
  iconBg?: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
}

/* -------------------------------------------------------------------------- */
/*  Animated Counter                                                          */
/* -------------------------------------------------------------------------- */

function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  formatted,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  formatted?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * eased);

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted ?? display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sparkline                                                                 */
/* -------------------------------------------------------------------------- */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;

  const width = 80;
  const height = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-${color})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stat Card                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const Icon = stat.icon;
  const isPositive = stat.change >= 0;
  const iconColor = stat.iconColor ?? 'text-emerald-600';
  const iconBg = stat.iconBg ?? 'bg-emerald-500/10';
  const sparkColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200/60 hover:shadow-glow-sm dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className={cn('mb-3 inline-flex rounded-xl p-2.5', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {stat.title}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              formatted={stat.formattedValue}
            />
          </p>
        </div>

        {/* Sparkline */}
        {stat.sparklineData && (
          <div className="mt-2">
            <Sparkline data={stat.sparklineData} color={sparkColor} />
          </div>
        )}
      </div>

      {/* Change indicator */}
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
            isPositive
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-500/10 text-red-700 dark:text-red-400'
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(stat.change).toFixed(1)}%
        </span>
        <span className="text-xs text-gray-400">vs last month</span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats Overview                                                            */
/* -------------------------------------------------------------------------- */

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} stat={stat} index={index} />
      ))}
    </div>
  );
}

export default StatsOverview;
