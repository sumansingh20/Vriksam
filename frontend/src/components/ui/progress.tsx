"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Progress component                                                 */
/* ------------------------------------------------------------------ */

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (0 - max) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Label placement */
  labelPlacement?: "inside" | "outside" | "top";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Enable shimmer animation on the filled portion */
  shimmer?: boolean;
  /** Gradient color set */
  color?: "green" | "blue" | "amber" | "red";
}

const sizeMap: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const gradientMap: Record<string, string> = {
  green: "from-emerald-400 via-green-500 to-teal-500",
  blue: "from-blue-400 via-blue-500 to-indigo-500",
  amber: "from-amber-400 via-orange-500 to-yellow-500",
  red: "from-red-400 via-rose-500 to-pink-500",
};

const bgMap: Record<string, string> = {
  green: "bg-emerald-100 dark:bg-emerald-950/30",
  blue: "bg-blue-100 dark:bg-blue-950/30",
  amber: "bg-amber-100 dark:bg-amber-950/30",
  red: "bg-red-100 dark:bg-red-950/30",
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      showLabel = false,
      labelPlacement = "outside",
      size = "md",
      shimmer = true,
      color = "green",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const displayPercentage = Math.round(percentage);

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${displayPercentage}% complete`}
        {...props}
      >
        {/* Top label */}
        {showLabel && labelPlacement === "top" && (
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {displayPercentage}%
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Track */}
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-full",
              bgMap[color],
              sizeMap[size]
            )}
          >
            {/* Filled bar */}
            <motion.div
              className={cn(
                "h-full rounded-full bg-gradient-to-r",
                gradientMap[color],
                "relative"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Shimmer overlay */}
              {shimmer && percentage > 0 && (
                <div
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-full",
                    "after:absolute after:inset-0",
                    "after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent",
                    "after:animate-[shimmer_2s_infinite]",
                    "after:-translate-x-full"
                  )}
                />
              )}

              {/* Inside label */}
              {showLabel && labelPlacement === "inside" && size === "lg" && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-sm">
                  {displayPercentage}%
                </span>
              )}
            </motion.div>
          </div>

          {/* Outside label */}
          {showLabel && labelPlacement === "outside" && (
            <span className="min-w-[3ch] text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
              {displayPercentage}%
            </span>
          )}
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
