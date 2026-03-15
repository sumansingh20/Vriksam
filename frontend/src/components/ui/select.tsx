"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Root / Value                                                       */
/* ------------------------------------------------------------------ */

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Input size */
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<string, string> = {
  sm: "h-9 text-xs px-3",
  md: "h-11 text-sm px-4",
  lg: "h-13 text-base px-5",
};

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, size = "md", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between rounded-xl",
      "bg-white/70 dark:bg-gray-900/50",
      "backdrop-blur-sm",
      "border border-gray-200/80 dark:border-gray-700/60",
      "text-gray-900 dark:text-white",
      "transition-all duration-300 ease-out",
      "focus:outline-none focus:border-emerald-500/70",
      "focus:ring-4 focus:ring-emerald-500/10",
      "focus:shadow-lg focus:shadow-emerald-500/5",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "placeholder:text-gray-400",
      sizeClasses[size],
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <svg
        className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 data-[state=open]:rotate-180"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

/* ------------------------------------------------------------------ */
/*  Scroll buttons                                                     */
/* ------------------------------------------------------------------ */

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      "text-gray-400",
      className
    )}
    {...props}
  >
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.78 9.78a.75.75 0 01-1.06 0L8 7.06 5.28 9.78a.75.75 0 01-1.06-1.06l3.25-3.25a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06z" />
    </svg>
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      "text-gray-400",
      className
    )}
    {...props}
  >
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" />
    </svg>
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        "relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-xl",
        /* Glassmorphism */
        "bg-white/85 dark:bg-gray-900/85",
        "backdrop-blur-2xl backdrop-saturate-150",
        "border border-white/40 dark:border-white/10",
        "shadow-xl shadow-emerald-900/10",
        /* Animations */
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=top]:slide-in-from-bottom-2",
        "data-[side=bottom]:slide-in-from-top-2",
        position === "popper" && [
          "data-[side=top]:-translate-y-1",
          "data-[side=bottom]:translate-y-1",
        ],
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1.5",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

/* ------------------------------------------------------------------ */
/*  Item                                                               */
/* ------------------------------------------------------------------ */

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Optional icon before label */
  icon?: React.ReactNode;
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, icon, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-9 pr-3 text-sm outline-none",
      "text-gray-700 dark:text-gray-300",
      "transition-colors duration-150",
      "focus:bg-emerald-50 focus:text-emerald-900",
      "dark:focus:bg-emerald-950/40 dark:focus:text-emerald-200",
      "data-[highlighted]:bg-emerald-50 dark:data-[highlighted]:bg-emerald-950/40",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>

    {icon && (
      <span className="mr-2 flex h-4 w-4 shrink-0 items-center justify-center opacity-60">
        {icon}
      </span>
    )}

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

/* ------------------------------------------------------------------ */
/*  Separator                                                          */
/* ------------------------------------------------------------------ */

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1.5 h-px bg-gray-200/60 dark:bg-gray-700/60",
      className
    )}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
