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
          "bg-white/60 dark:bg-gray-900/50",
          "backdrop-blur-xl backdrop-saturate-150",
          "border border-white/30 dark:border-white/10",
          "shadow-lg shadow-emerald-900/5",
          "hover:shadow-xl hover:shadow-emerald-900/10",
          "hover:bg-white/70 dark:hover:bg-gray-900/60",
        ].join(" "),
        solid: [
          "bg-white dark:bg-gray-900",
          "border border-gray-200 dark:border-gray-800",
          "shadow-md shadow-gray-900/5",
          "hover:shadow-lg hover:shadow-gray-900/10",
        ].join(" "),
        outline: [
          "bg-transparent",
          "border-2 border-emerald-200/50 dark:border-emerald-800/50",
          "hover:border-emerald-300/70 dark:hover:border-emerald-700/70",
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
