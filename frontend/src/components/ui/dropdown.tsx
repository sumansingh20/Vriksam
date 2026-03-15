"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const menuAnimation = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -2,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

/* ------------------------------------------------------------------ */
/*  Root / Trigger / Group / Portal / Sub                              */
/* ------------------------------------------------------------------ */

const Dropdown = DropdownMenuPrimitive.Root;
const DropdownTrigger = DropdownMenuPrimitive.Trigger;
const DropdownGroup = DropdownMenuPrimitive.Group;
const DropdownPortal = DropdownMenuPrimitive.Portal;
const DropdownSub = DropdownMenuPrimitive.Sub;
const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      asChild
      {...props}
    >
      <motion.div
        className={cn(
          "z-50 min-w-[180px] overflow-hidden rounded-xl p-1.5",
          /* Glassmorphism */
          "bg-white/80 dark:bg-gray-900/80",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-white/40 dark:border-white/10",
          "shadow-xl shadow-emerald-900/10",
          className
        )}
        variants={menuAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));
DropdownContent.displayName = "DropdownContent";

/* ------------------------------------------------------------------ */
/*  Item                                                               */
/* ------------------------------------------------------------------ */

export interface DropdownItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Optional icon before label */
  icon?: React.ReactNode;
  /** Show a shortcut hint on the right */
  shortcut?: string;
  /** Destructive styling */
  destructive?: boolean;
}

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(({ className, icon, shortcut, destructive, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "group relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none",
      "transition-colors duration-150",
      destructive
        ? [
            "text-red-600 dark:text-red-400",
            "focus:bg-red-50 dark:focus:bg-red-950/40",
            "data-[highlighted]:bg-red-50 dark:data-[highlighted]:bg-red-950/40",
          ]
        : [
            "text-gray-700 dark:text-gray-300",
            "focus:bg-emerald-50 focus:text-emerald-900",
            "dark:focus:bg-emerald-950/40 dark:focus:text-emerald-200",
            "data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-900",
            "dark:data-[highlighted]:bg-emerald-950/40",
          ],
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {icon && (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-current opacity-60 group-focus:opacity-100">
        {icon}
      </span>
    )}
    <span className="flex-1">{children}</span>
    {shortcut && (
      <span className="ml-auto text-xs tracking-widest text-gray-400 dark:text-gray-500">
        {shortcut}
      </span>
    )}
  </DropdownMenuPrimitive.Item>
));
DropdownItem.displayName = "DropdownItem";

/* ------------------------------------------------------------------ */
/*  Checkbox Item                                                      */
/* ------------------------------------------------------------------ */

const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-9 pr-3 text-sm outline-none",
      "transition-colors duration-150",
      "text-gray-700 dark:text-gray-300",
      "focus:bg-emerald-50 dark:focus:bg-emerald-950/40",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

/* ------------------------------------------------------------------ */
/*  Radio Item                                                         */
/* ------------------------------------------------------------------ */

const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-9 pr-3 text-sm outline-none",
      "transition-colors duration-150",
      "text-gray-700 dark:text-gray-300",
      "focus:bg-emerald-50 dark:focus:bg-emerald-950/40",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownRadioItem.displayName = "DropdownRadioItem";

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500",
      inset && "pl-9",
      className
    )}
    {...props}
  />
));
DropdownLabel.displayName = "DropdownLabel";

/* ------------------------------------------------------------------ */
/*  Separator                                                          */
/* ------------------------------------------------------------------ */

const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1.5 h-px bg-gray-200/60 dark:bg-gray-700/60",
      className
    )}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";

/* ------------------------------------------------------------------ */
/*  SubTrigger                                                         */
/* ------------------------------------------------------------------ */

const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    icon?: React.ReactNode;
  }
>(({ className, icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none",
      "text-gray-700 dark:text-gray-300",
      "focus:bg-emerald-50 dark:focus:bg-emerald-950/40",
      "data-[state=open]:bg-emerald-50 dark:data-[state=open]:bg-emerald-950/40",
      className
    )}
    {...props}
  >
    {icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-60">{icon}</span>}
    <span className="flex-1">{children}</span>
    <svg className="ml-auto h-4 w-4 opacity-50" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" />
    </svg>
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownSubTrigger.displayName = "DropdownSubTrigger";

/* ------------------------------------------------------------------ */
/*  SubContent                                                         */
/* ------------------------------------------------------------------ */

const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[180px] overflow-hidden rounded-xl p-1.5",
      "bg-white/80 dark:bg-gray-900/80",
      "backdrop-blur-2xl backdrop-saturate-150",
      "border border-white/40 dark:border-white/10",
      "shadow-xl shadow-emerald-900/10",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      className
    )}
    {...props}
  />
));
DropdownSubContent.displayName = "DropdownSubContent";

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownRadioGroup,
  DropdownLabel,
  DropdownSeparator,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
};
