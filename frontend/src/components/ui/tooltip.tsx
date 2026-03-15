"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Provider (wrap your app tree with this)                            */
/* ------------------------------------------------------------------ */

const TooltipProvider = TooltipPrimitive.Provider;

/* ------------------------------------------------------------------ */
/*  Root & Trigger                                                     */
/* ------------------------------------------------------------------ */

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-xs overflow-hidden rounded-lg px-3 py-1.5 text-xs font-medium",
        /* Glassmorphism */
        "bg-gray-900/85 dark:bg-gray-800/90",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/10",
        "text-white shadow-xl shadow-black/20",
        /* Animations */
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=top]:slide-in-from-bottom-2",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-gray-900/85 dark:fill-gray-800/90" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";

/* ------------------------------------------------------------------ */
/*  Convenience wrapper                                                */
/* ------------------------------------------------------------------ */

export interface SimpleTooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Tooltip placement */
  side?: "top" | "right" | "bottom" | "left";
  /** Delay before showing */
  delayDuration?: number;
  /** The trigger element */
  children: React.ReactNode;
  /** Additional classes on content */
  className?: string;
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  side = "top",
  delayDuration = 200,
  children,
  className,
}) => (
  <Tooltip delayDuration={delayDuration}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} className={className}>
      {content}
    </TooltipContent>
  </Tooltip>
);

SimpleTooltip.displayName = "SimpleTooltip";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
};
