"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Card variants                                                      */
/* ------------------------------------------------------------------ */

const cardVariants = cva(
  [
    "rounded-2xl transition-all duration-300",
    "focus-within:ring-2 focus-within:ring-emerald-500/20",
  ].join(" "),
  {
    variants: {
      variant: {
        glass: [
          "bg-white/70 dark:bg-gray-900/50",
          "backdrop-blur-xl backdrop-saturate-[1.8]",
          "border border-white/40 dark:border-white/[0.08]",
          "shadow-[0_8px_32px_rgba(0,0,0,0.04),0_2px_8px_rgba(16,185,129,0.04)]",
          "hover:shadow-[0_16px_48px_rgba(0,0,0,0.06),0_4px_12px_rgba(16,185,129,0.08)]",
          "hover:bg-white/80 dark:hover:bg-gray-900/60",
          "hover:border-emerald-200/40 dark:hover:border-emerald-500/15",
        ].join(" "),
        solid: [
          "bg-white dark:bg-gray-900",
          "border border-gray-200/80 dark:border-gray-800",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]",
          "hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.06)]",
        ].join(" "),
        outline: [
          "bg-transparent",
          "border-2 border-emerald-200/50 dark:border-emerald-800/50",
          "hover:border-emerald-300/70 dark:hover:border-emerald-700/70",
          "hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20",
        ].join(" "),
        elevated: [
          "bg-white dark:bg-gray-900",
          "border border-gray-100 dark:border-gray-800",
          "shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]",
          "hover:shadow-[0_8px_40px_rgba(16,185,129,0.1),0_2px_8px_rgba(0,0,0,0.06)]",
          "hover:border-emerald-100 dark:hover:border-emerald-900/40",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "glass",
    },
  }
);

/* ------------------------------------------------------------------ */
/*  Card                                                                */
/* ------------------------------------------------------------------ */

export interface CardProps
  extends Omit<HTMLMotionProps<"div">, "children">,
    VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
  /** Disable hover lift animation */
  disableHover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, disableHover = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        whileHover={disableHover ? undefined : { y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

/* ------------------------------------------------------------------ */
/*  Card sub-components                                                */
/* ------------------------------------------------------------------ */

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm leading-relaxed text-gray-500 dark:text-gray-400",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center px-6 pt-2 pb-6",
      "border-t border-gray-100/50 dark:border-gray-800/50",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
