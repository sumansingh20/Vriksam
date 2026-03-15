"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Size config                                                        */
/* ------------------------------------------------------------------ */

const sizeConfig: Record<string, { container: string; leaf: string; viewBox: string }> = {
  sm: { container: "h-6 w-6", leaf: "scale-75", viewBox: "0 0 24 24" },
  md: { container: "h-10 w-10", leaf: "scale-100", viewBox: "0 0 24 24" },
  lg: { container: "h-16 w-16", leaf: "scale-125", viewBox: "0 0 24 24" },
  xl: { container: "h-24 w-24", leaf: "scale-150", viewBox: "0 0 24 24" },
};

/* ------------------------------------------------------------------ */
/*  Leaf SVG path                                                      */
/* ------------------------------------------------------------------ */

const LeafPath: React.FC<{ className?: string }> = ({ className }) => (
  <path
    className={className}
    d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

/* ------------------------------------------------------------------ */
/*  Loading Spinner component                                          */
/* ------------------------------------------------------------------ */

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Show label text below spinner */
  label?: string;
  /** Color variant */
  color?: "green" | "white" | "gray";
}

const colorMap: Record<string, { text: string; gradient: string[] }> = {
  green: {
    text: "text-emerald-600 dark:text-emerald-400",
    gradient: ["#10b981", "#059669", "#047857"],
  },
  white: {
    text: "text-white",
    gradient: ["#ffffff", "#e5e7eb", "#d1d5db"],
  },
  gray: {
    text: "text-gray-400",
    gradient: ["#9ca3af", "#6b7280", "#4b5563"],
  },
};

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", label, color = "green", ...props }, ref) => {
    const config = sizeConfig[size]!;
    const colors = colorMap[color]!;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-3", className)}
        role="status"
        aria-label={label ?? "Loading"}
        {...props}
      >
        {/* Animated leaf spinner */}
        <div className={cn("relative", config.container)}>
          {/* Rotating leaves */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.15,
              }}
              style={{ transformOrigin: "center center" }}
            >
              <svg
                viewBox={config.viewBox}
                className={cn("h-full w-full", colors.text)}
                style={{ opacity: 0.2 + i * 0.25 }}
              >
                <LeafPath />
              </svg>
            </motion.div>
          ))}

          {/* Center pulse dot */}
          <motion.div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "rounded-full",
              size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : size === "lg" ? "h-3 w-3" : "h-4 w-4"
            )}
            style={{ backgroundColor: colors.gradient[0] }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Label */}
        {label && (
          <motion.span
            className={cn(
              "text-sm font-medium",
              colors.text
            )}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {label}
          </motion.span>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

/* ------------------------------------------------------------------ */
/*  Simple circular spinner (alternative)                              */
/* ------------------------------------------------------------------ */

export interface CircularSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const circularSizeMap: Record<string, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

const CircularSpinner = React.forwardRef<HTMLDivElement, CircularSpinnerProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <svg
        className={cn("animate-spin", circularSizeMap[size])}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="text-emerald-500"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
);

CircularSpinner.displayName = "CircularSpinner";

export { LoadingSpinner, CircularSpinner };
