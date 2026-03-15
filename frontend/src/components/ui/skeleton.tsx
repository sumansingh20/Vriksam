"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Skeleton component                                                 */
/* ------------------------------------------------------------------ */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pre-defined shape variant */
  variant?: "text" | "circle" | "card" | "chart" | "custom";
  /** Width (only for text & custom) */
  width?: string | number;
  /** Height (only for text & custom) */
  height?: string | number;
  /** Number of text lines to generate */
  lines?: number;
  /** Animate the shimmer */
  animate?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "custom",
      width,
      height,
      lines = 1,
      animate = true,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      "rounded-lg",
      "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
      "dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
      "bg-[length:200%_100%]",
      animate && "animate-[shimmer_1.5s_ease-in-out_infinite]"
    );

    /* ---- Text variant ---- */
    if (variant === "text") {
      return (
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClasses,
                "h-4",
                i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
              )}
              style={{
                width: i === 0 ? width : undefined,
                height,
              }}
            />
          ))}
        </div>
      );
    }

    /* ---- Circle variant ---- */
    if (variant === "circle") {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, "rounded-full", className)}
          style={{
            width: width ?? 40,
            height: height ?? width ?? 40,
          }}
          {...props}
        />
      );
    }

    /* ---- Card variant ---- */
    if (variant === "card") {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-2xl border border-gray-200/40 dark:border-gray-700/40 p-5 space-y-4",
            "bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm",
            className
          )}
          {...props}
        >
          {/* Header area */}
          <div className="flex items-center gap-3">
            <div className={cn(baseClasses, "h-10 w-10 rounded-full")} />
            <div className="flex-1 space-y-2">
              <div className={cn(baseClasses, "h-4 w-2/3")} />
              <div className={cn(baseClasses, "h-3 w-1/3")} />
            </div>
          </div>
          {/* Body */}
          <div className="space-y-2">
            <div className={cn(baseClasses, "h-3 w-full")} />
            <div className={cn(baseClasses, "h-3 w-5/6")} />
            <div className={cn(baseClasses, "h-3 w-4/6")} />
          </div>
          {/* Footer */}
          <div className="flex gap-2 pt-2">
            <div className={cn(baseClasses, "h-8 w-20 rounded-lg")} />
            <div className={cn(baseClasses, "h-8 w-20 rounded-lg")} />
          </div>
        </div>
      );
    }

    /* ---- Chart variant ---- */
    if (variant === "chart") {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-2xl border border-gray-200/40 dark:border-gray-700/40 p-5",
            "bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm",
            className
          )}
          {...props}
        >
          {/* Title */}
          <div className={cn(baseClasses, "h-5 w-1/3 mb-4")} />
          {/* Bars */}
          <div className="flex items-end gap-2 h-32">
            {[60, 80, 45, 90, 55, 70, 85].map((h, i) => (
              <div
                key={i}
                className={cn(baseClasses, "flex-1 rounded-t-md")}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="flex gap-2 mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={cn(baseClasses, "flex-1 h-3 rounded")} />
            ))}
          </div>
        </div>
      );
    }

    /* ---- Custom / default ---- */
    return (
      <div
        ref={ref}
        className={cn(baseClasses, className)}
        style={{ width, height }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
