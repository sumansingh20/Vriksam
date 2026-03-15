"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Badge variants                                                     */
/* ------------------------------------------------------------------ */

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full font-medium",
    "transition-colors duration-200",
    "text-xs px-2.5 py-0.5",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-emerald-100/80 text-emerald-800",
          "border border-emerald-200/50",
          "dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/40",
        ].join(" "),
        success: [
          "bg-green-100/80 text-green-800",
          "border border-green-200/50",
          "dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/40",
        ].join(" "),
        warning: [
          "bg-amber-100/80 text-amber-800",
          "border border-amber-200/50",
          "dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/40",
        ].join(" "),
        destructive: [
          "bg-red-100/80 text-red-800",
          "border border-red-200/50",
          "dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/40",
        ].join(" "),
        info: [
          "bg-blue-100/80 text-blue-800",
          "border border-blue-200/50",
          "dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/40",
        ].join(" "),
        outline: [
          "bg-transparent text-gray-700 border border-gray-300",
          "dark:text-gray-300 dark:border-gray-600",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* ------------------------------------------------------------------ */
/*  Pulse dot                                                          */
/* ------------------------------------------------------------------ */

const pulseColorMap: Record<string, string> = {
  default: "bg-emerald-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  destructive: "bg-red-500",
  info: "bg-blue-500",
  outline: "bg-gray-500",
};

/* ------------------------------------------------------------------ */
/*  Badge component                                                    */
/* ------------------------------------------------------------------ */

export interface BadgeProps
  extends Omit<HTMLMotionProps<"span">, "children">,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  /** Show a pulsing dot to indicate active / live status */
  pulse?: boolean;
  /** Optional icon before label */
  icon?: React.ReactNode;
  /** Remove on click callback - shows X button */
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "default", pulse, icon, onRemove, children, ...props },
    ref
  ) => {
    return (
      <motion.span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        {...props}
      >
        {/* Pulse indicator */}
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                pulseColorMap[variant ?? "default"]
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                pulseColorMap[variant ?? "default"]
              )}
            />
          </span>
        )}

        {icon && <span className="shrink-0">{icon}</span>}

        {children}

        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              "ml-0.5 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full",
              "transition-colors duration-150",
              "hover:bg-black/10 dark:hover:bg-white/10",
              "focus:outline-none focus:ring-1 focus:ring-current"
            )}
            aria-label="Remove"
          >
            <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="currentColor">
              <path d="M1.707.293A1 1 0 00.293 1.707L3.586 5 .293 8.293a1 1 0 101.414 1.414L5 6.414l3.293 3.293a1 1 0 001.414-1.414L6.414 5l3.293-3.293A1 1 0 008.293.293L5 3.586 1.707.293z" />
            </svg>
          </button>
        )}
      </motion.span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
