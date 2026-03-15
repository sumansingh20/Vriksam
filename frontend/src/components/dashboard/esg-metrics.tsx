'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CloudRain,
  Wind,
  Award,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface ESGMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  target: number;
  trend: number; // percentage
  icon: 'co2' | 'o2' | 'green_score' | 'wellness';
  gradient: string;
}

interface ESGMetricsProps {
  metrics?: ESGMetric[];
}

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const ICON_MAP = {
  co2: CloudRain,
  o2: Wind,
  green_score: Award,
  wellness: Heart,
};

/* -------------------------------------------------------------------------- */
/*  Default data                                                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_METRICS: ESGMetric[] = [
  {
    id: 'co2',
    title: 'CO2 Absorbed',
    value: 1284,
    unit: 'kg',
    target: 2000,
    trend: 12.5,
    icon: 'co2',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    id: 'o2',
    title: 'O2 Produced',
    value: 964,
    unit: 'kg',
    target: 1500,
    trend: 8.3,
    icon: 'o2',
    gradient: 'from-sky-500 to-cyan-600',
  },
  {
    id: 'green_score',
    title: 'Green Score',
    value: 87,
    unit: '/100',
    target: 100,
    trend: 5.2,
    icon: 'green_score',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'wellness',
    title: 'Wellness Impact',
    value: 92,
    unit: '%',
    target: 100,
    trend: 3.1,
    icon: 'wellness',
    gradient: 'from-rose-500 to-pink-600',
  },
];

/* -------------------------------------------------------------------------- */
/*  Progress Ring                                                             */
/* -------------------------------------------------------------------------- */

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
  const percentage = Math.min(value / max, 1);

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
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated Value                                                            */
/* -------------------------------------------------------------------------- */

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

  return <span className="tabular-nums">{display.toLocaleString()}</span>;
}

/* -------------------------------------------------------------------------- */
/*  ESG Card                                                                  */
/* -------------------------------------------------------------------------- */

function ESGCard({ metric, index }: { metric: ESGMetric; index: number }) {
  const Icon = ICON_MAP[metric.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white',
        metric.gradient
      )}
    >
      {/* Background pattern */}
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
            +{metric.trend}% this month
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ESGMetrics({ metrics = DEFAULT_METRICS }: ESGMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <ESGCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}

export default ESGMetrics;
