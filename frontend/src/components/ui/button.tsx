"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Variant definitions                                                */
/* ------------------------------------------------------------------ */

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "rounded-xl font-semibold tracking-tight",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600",
          "text-white shadow-lg shadow-emerald-500/25",
          "hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110",
          "active:brightness-95 active:shadow-md",
        ].join(" "),
        secondary: [
          "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
          "hover:bg-emerald-100 hover:border-emerald-300/80",
          "active:bg-emerald-150",
          "dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
          "dark:hover:bg-emerald-900/50",
        ].join(" "),
        outline: [
          "border-2 border-emerald-500/40 text-emerald-700 bg-transparent",
          "hover:bg-emerald-50 hover:border-emerald-500/70",
          "active:bg-emerald-100",
          "dark:text-emerald-400 dark:hover:bg-emerald-950/40",
        ].join(" "),
        ghost: [
          "text-emerald-700 bg-transparent",
          "hover:bg-emerald-50",
          "active:bg-emerald-100",
          "dark:text-emerald-400 dark:hover:bg-emerald-950/30",
        ].join(" "),
        destructive: [
          "bg-gradient-to-r from-red-600 to-rose-600",
          "text-white shadow-lg shadow-red-500/25",
          "hover:shadow-xl hover:shadow-red-500/30 hover:brightness-110",
          "active:brightness-95 active:shadow-md",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base rounded-2xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/* ------------------------------------------------------------------ */
/*  Ripple hook                                                        */
/* ------------------------------------------------------------------ */

interface Ripple {
  x: number;
  y: number;
  id: number;
}

function useRipple() {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const addRipple = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 800);
    },
    []
  );

  return { ripples, addRipple };
}

/* ------------------------------------------------------------------ */
/*  Spinner sub-component                                              */
/* ------------------------------------------------------------------ */

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Button component                                                   */
/* ------------------------------------------------------------------ */

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  /** Replaces content with a spinner */
  loading?: boolean;
  /** Content rendered inside the button */
  children?: React.ReactNode;
  /** Accessible loading label */
  loadingText?: string;
  /** Element placed before children */
  leftIcon?: React.ReactNode;
  /** Element placed after children */
  rightIcon?: React.ReactNode;
  /** Disable the ripple click effect */
  disableRipple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      children,
      leftIcon,
      rightIcon,
      disableRipple = false,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const { ripples, addRipple } = useRipple();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disableRipple) addRipple(e);
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {/* Ripple layer */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute animate-[ripple_0.8s_ease-out] rounded-full bg-white/30"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
            }}
          />
        ))}

        {/* Content */}
        {loading ? (
          <>
            <Spinner className="h-4 w-4" />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
