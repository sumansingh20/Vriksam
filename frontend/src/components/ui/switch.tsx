"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Switch component                                                   */
/* ------------------------------------------------------------------ */

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Size of the switch */
  size?: "sm" | "md" | "lg";
  /** Label text */
  label?: string;
  /** Description below the label */
  description?: string;
}

const switchSizeMap: Record<string, { root: string; thumb: string; translate: string }> = {
  sm: {
    root: "h-5 w-9",
    thumb: "h-3.5 w-3.5",
    translate: "data-[state=checked]:translate-x-[18px]",
  },
  md: {
    root: "h-6 w-11",
    thumb: "h-4.5 w-4.5",
    translate: "data-[state=checked]:translate-x-[22px]",
  },
  lg: {
    root: "h-7 w-14",
    thumb: "h-5.5 w-5.5",
    translate: "data-[state=checked]:translate-x-[30px]",
  },
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = "md", label, description, id: providedId, ...props }, ref) => {
  const internalId = React.useId();
  const id = providedId ?? internalId;
  const sizeConfig = switchSizeMap[size]!;

  const switchElement = (
    <SwitchPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20",
        "focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        /* Off state */
        "bg-gray-200 dark:bg-gray-700",
        /* On state */
        "data-[state=checked]:bg-gradient-to-r",
        "data-[state=checked]:from-emerald-500 data-[state=checked]:to-green-500",
        "data-[state=checked]:shadow-lg data-[state=checked]:shadow-emerald-500/25",
        sizeConfig.root,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white",
          "shadow-md shadow-black/10",
          "transition-transform duration-300 ease-out",
          "translate-x-0.5",
          sizeConfig.thumb,
          sizeConfig.translate,
          /* Glow on active */
          "data-[state=checked]:shadow-emerald-200"
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        {switchElement}
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer leading-tight"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return switchElement;
});

Switch.displayName = "Switch";

export { Switch };
