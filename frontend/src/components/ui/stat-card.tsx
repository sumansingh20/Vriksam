"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useAnimatedCounter(target: number, duration = 1.2) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    if (target % 1 !== 0) {
      return latest.toFixed(1);
    }
    return Math.round(latest).toLocaleString();
  });

  React.useEffect(() => {
    const controls = animate(motionValue, target, {
      duration,
      ease: "easeOut",
    });
    return controls.stop;
  }, [target, duration, motionValue]);

  return rounded;
}

/* ------------------------------------------------------------------ */
/*  Trend indicator                                                    */
/* ------------------------------------------------------------------ */

interface TrendIndicatorProps {
  value: number;
  suffix?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  suffix = "%",
}) => {
  const isUp = value > 0;
  const isDown = value < 0;
  const isNeutral = value === 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        isUp && "text-emerald-600 dark:text-emerald-400",
        isDown && "text-red-500 dark:text-red-400",
        isNeutral && "text-gray-400"
      )}
    >
      {isUp && (
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 4a.5.5 0 01.354.146l4 4a.5.5 0 01-.708.708L8 5.207 4.354 8.854a.5.5 0 11-.708-.708l4-4A.5.5 0 018 4z" />
        </svg>
      )}
      {isDown && (
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12a.5.5 0 01-.354-.146l-4-4a.5.5 0 11.708-.708L8 10.793l3.646-3.647a.5.5 0 01.708.708l-4 4A.5.5 0 018 12z" />
        </svg>
      )}
      {isNeutral && <span className="text-gray-400">--</span>}
      {!isNeutral && (
        <span>
          {isUp ? "+" : ""}
          {value}
          {suffix}
        </span>
      )}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Mini sparkline                                                     */
/* ------------------------------------------------------------------ */

interface SparklineProps {
  data: number[];
  color?: string;
  className?: string;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = "#10b981",
  className,
}) => {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${width - padding},${height} L${padding},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full h-8", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-fill)" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  StatCard component                                                 */
/* ------------------------------------------------------------------ */

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  /** Icon rendered in the top-left */
  icon?: React.ReactNode;
  /** Main stat label */
  label: string;
  /** Numeric value to display (will animate) */
  value: number;
  /** Prefix before value (e.g. "$") */
  prefix?: string;
  /** Suffix after value (e.g. "kWh") */
  suffix?: string;
  /** Percentage change for trend indicator */
  trend?: number;
  /** Trend suffix (default "%") */
  trendSuffix?: string;
  /** Sparkline data points */
  sparklineData?: number[];
  /** Sparkline color */
  sparklineColor?: string;
  /** Icon background color class */
  iconBg?: string;
  /** Icon text color class */
  iconColor?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      icon,
      label,
      value,
      prefix,
      suffix,
      trend,
      trendSuffix,
      sparklineData,
      sparklineColor,
      iconBg = "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor = "text-emerald-600 dark:text-emerald-400",
      ...props
    },
    ref
  ) => {
    const animatedValue = useAnimatedCounter(value);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl p-5",
          /* Glassmorphism */
          "bg-white/70 dark:bg-gray-900/50",
          "backdrop-blur-xl backdrop-saturate-[1.8]",
          "border border-white/40 dark:border-white/[0.08]",
          "shadow-[0_8px_32px_rgba(0,0,0,0.04),0_2px_8px_rgba(16,185,129,0.04)]",
          "hover:shadow-[0_16px_48px_rgba(0,0,0,0.06),0_4px_12px_rgba(16,185,129,0.08)]",
          "transition-all duration-300",
          className
        )}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400/80 via-green-500/60 to-teal-400/40" />
        {/* Top row: icon + trend */}
        <div className="flex items-start justify-between mb-3">
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                iconBg,
                iconColor
              )}
            >
              {icon}
            </div>
          )}
          {trend !== undefined && (
            <TrendIndicator value={trend} suffix={trendSuffix} />
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          {prefix && (
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
              {prefix}
            </span>
          )}
          <motion.span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading">
            {animatedValue}
          </motion.span>
          {suffix && (
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-0.5">
              {suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="mt-3 -mx-1">
            <Sparkline data={sparklineData} color={sparklineColor} />
          </div>
        )}
      </motion.div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard, TrendIndicator, Sparkline, useAnimatedCounter };
