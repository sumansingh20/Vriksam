"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Tabs Root                                                          */
/* ------------------------------------------------------------------ */

const Tabs = TabsPrimitive.Root;

/* ------------------------------------------------------------------ */
/*  Tabs List (with sliding indicator)                                 */
/* ------------------------------------------------------------------ */

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** Visual style variant */
  variant?: "underline" | "pill" | "glass";
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "underline", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1",
      variant === "underline" && [
        "border-b border-gray-200/60 dark:border-gray-700/60",
      ],
      variant === "pill" && [
        "rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1",
        "backdrop-blur-sm",
      ],
      variant === "glass" && [
        "rounded-xl p-1",
        "bg-white/40 dark:bg-gray-900/40",
        "backdrop-blur-xl border border-white/30 dark:border-white/10",
      ],
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

/* ------------------------------------------------------------------ */
/*  Tabs Trigger                                                       */
/* ------------------------------------------------------------------ */

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Visual style variant (should match parent TabsList) */
  variant?: "underline" | "pill" | "glass";
  /** Optional icon */
  icon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = "underline", icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
      "transition-all duration-200 outline-none select-none",
      "disabled:pointer-events-none disabled:opacity-50",

      /* Underline variant */
      variant === "underline" && [
        "px-4 py-2.5 -mb-px",
        "text-gray-500 dark:text-gray-400",
        "hover:text-emerald-600 dark:hover:text-emerald-400",
        "data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300",
      ],

      /* Pill variant */
      variant === "pill" && [
        "px-4 py-2 rounded-lg",
        "text-gray-600 dark:text-gray-400",
        "hover:text-gray-900 dark:hover:text-gray-200",
        "data-[state=active]:text-emerald-700 dark:data-[state=active]:text-white",
        "data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-600",
        "data-[state=active]:shadow-sm",
      ],

      /* Glass variant */
      variant === "glass" && [
        "px-4 py-2 rounded-lg",
        "text-gray-600 dark:text-gray-400",
        "hover:text-emerald-700 dark:hover:text-emerald-300",
        "data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-200",
        "data-[state=active]:bg-white/70 dark:data-[state=active]:bg-emerald-900/50",
        "data-[state=active]:shadow-sm",
        "data-[state=active]:backdrop-blur-sm",
      ],

      className
    )}
    {...props}
  >
    {icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span>}
    {children}

    {/* Animated underline indicator */}
    {variant === "underline" && (
      <TabsActiveIndicator />
    )}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = "TabsTrigger";

/* ------------------------------------------------------------------ */
/*  Animated active indicator (underline)                              */
/* ------------------------------------------------------------------ */

const TabsActiveIndicator: React.FC = () => (
  <motion.span
    className={cn(
      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
      "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
    )}
    layoutId="tabs-active-indicator"
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    style={{ display: "var(--tab-indicator-display, none)" }}
  />
);

/* ------------------------------------------------------------------ */
/*  Custom wrapper that manages the sliding indicator                  */
/* ------------------------------------------------------------------ */

export interface AnimatedTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Optional icon */
  icon?: React.ReactNode;
  /** Is this the currently active tab? */
  isActive?: boolean;
}

const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  AnimatedTabsTriggerProps
>(({ className, icon, isActive, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
      "px-4 py-2.5 -mb-px text-sm font-medium",
      "transition-colors duration-200 outline-none select-none",
      "text-gray-500 dark:text-gray-400",
      "hover:text-emerald-600 dark:hover:text-emerald-400",
      "data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span>}
    {children}

    {/* Animated sliding underline */}
    {isActive && (
      <motion.span
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
          "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
        )}
        layoutId="active-tab-indicator"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </TabsPrimitive.Trigger>
));
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger";

/* ------------------------------------------------------------------ */
/*  Tabs Content                                                       */
/* ------------------------------------------------------------------ */

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 outline-none",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2",
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0",
      "focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2 rounded-lg",
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Content>
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent, AnimatedTabsTrigger };
