'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Award, Heart, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ESGMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  target: number;
  trend?: number;
  icon: 'co2' | 'o2' | 'green_score' | 'wellness';
  gradient: string;
}

interface ESGMetricsProps {
  metrics: ESGMetric[];
  isLoading?: boolean;
}

const ICON_MAP = {
  co2: CloudRain,
  o2: Wind,
  green_score: Award,
  wellness: Heart,
};

function ProgressRing({
  value,
  max,
  size = 56,
  strokeWidth = 4,
  color,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(value / Math.max(max, 1), 1);

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - percentage * circumference);
    }, 200);
    return () => clearTimeout(timer);
  }, [circumference, percentage]);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-white/10"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="[transition:stroke-dashoffset_1.2s_ease-out]"
      />
    </svg>
  );
}

function AnimatedValue({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <span className="tabular-nums">{display.toLocaleString('en-IN')}</span>;
}

function ESGCard({ metric, index }: { metric: ESGMetric; index: number }) {
  const Icon = ICON_MAP[metric.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white',
        metric.gradient,
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5 blur-lg" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="h-5 w-5" />
          </div>
          <ProgressRing
            value={metric.value}
            max={metric.target}
            color="rgba(255,255,255,0.9)"
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-white/80">{metric.title}</p>
          <p className="mt-1 text-2xl font-bold">
            <AnimatedValue value={metric.value} />
            <span className="ml-1 text-sm font-normal text-white/70">
              {metric.unit}
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-white/70" />
          <span className="text-xs font-medium text-white/80">
            {typeof metric.trend === 'number'
              ? `${metric.trend > 0 ? '+' : ''}${metric.trend.toFixed(1)}% trend`
              : 'Live metric snapshot'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/50"
    >
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      <div className="mt-4 h-8 w-28 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      <div className="mt-3 h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
    </motion.div>
  );
}

export function ESGMetrics({ metrics, isLoading = false }: ESGMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <LoadingCard key={index} index={index} />
        ))}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-gray-300/70 bg-white/70 px-6 text-center dark:border-white/10 dark:bg-gray-900/40">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ESG metrics are not available for this account yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <ESGCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}

export default ESGMetrics;
