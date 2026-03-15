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
  change: number;
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

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted ?? display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sparkline                                                                 */
/* -------------------------------------------------------------------------- */

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;

  const width = 72;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(' L')}`;
  const color = positive ? '#10b981' : '#ef4444';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stat Card                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const Icon = stat.icon;
  const isPositive = stat.change >= 0;
  const iconColor = stat.iconColor ?? 'text-gray-600';
  const iconBg = stat.iconBg ?? 'bg-gray-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={cn('mb-3 inline-flex rounded-lg p-2', iconBg)}>
            <Icon className={cn('h-4.5 w-4.5', iconColor)} />
          </div>
          <p className="text-sm text-gray-500">{stat.title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              formatted={stat.formattedValue}
            />
          </p>
        </div>

        {stat.sparklineData && (
          <div className="mt-6">
            <Sparkline data={stat.sparklineData} positive={isPositive} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-medium',
            isPositive ? 'text-emerald-600' : 'text-red-600'
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
