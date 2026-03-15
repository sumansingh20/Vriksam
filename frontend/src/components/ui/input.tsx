"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Size variants                                                      */
/* ------------------------------------------------------------------ */

const inputSizeVariants = cva("", {
  variants: {
    inputSize: {
      sm: "h-9 text-xs",
      md: "h-11 text-sm",
      lg: "h-13 text-base",
    },
  },
  defaultVariants: {
    inputSize: "md",
  },
});

/* ------------------------------------------------------------------ */
/*  Input component                                                    */
/* ------------------------------------------------------------------ */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputSizeVariants> {
  /** Floating label text */
  label?: string;
  /** Error message shown below the input */
  error?: string;
  /** Helper text shown below the input when no error */
  helperText?: string;
  /** Icon rendered on the left side */
  leftIcon?: React.ReactNode;
  /** Icon rendered on the right side */
  rightIcon?: React.ReactNode;
  /** Outer wrapper className */
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      inputSize,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const internalId = React.useId();
    const id = providedId ?? internalId;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(
      Boolean(props.value || props.defaultValue)
    );

    const isFloating = isFocused || hasValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
                "text-gray-400 transition-colors duration-200",
                isFocused && "text-emerald-500"
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            className={cn(
              /* Base */
              "peer w-full rounded-xl bg-white/70 dark:bg-gray-900/50",
              "backdrop-blur-sm",
              "border border-gray-200/80 dark:border-gray-700/60",
              "px-4 text-gray-900 dark:text-white",
              "placeholder-transparent",
              "transition-all duration-300 ease-out",
              /* Focus */
              "focus:outline-none",
              "focus:border-emerald-500/70",
              "focus:ring-4 focus:ring-emerald-500/10",
              "focus:bg-white dark:focus:bg-gray-900/70",
              "focus:shadow-lg focus:shadow-emerald-500/5",
              /* Error */
              error && [
                "border-red-400/80 dark:border-red-500/60",
                "focus:border-red-500 focus:ring-red-500/10",
              ],
              /* Disabled */
              "disabled:cursor-not-allowed disabled:opacity-50",
              /* Icon padding */
              leftIcon ? "pl-10" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              /* Label offset */
              label && "pt-5 pb-1",
              /* Size */
              inputSizeVariants({ inputSize }),
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            {...props}
          />

          {/* Floating label */}
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "pointer-events-none absolute left-4 transition-all duration-200 ease-out",
                leftIcon && "left-10",
                isFloating
                  ? "top-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                  : "top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500",
                error &&
                  isFloating &&
                  "text-red-500 dark:text-red-400"
              )}
            >
              {label}
            </label>
          )}

          {/* Right icon */}
          {rightIcon && (
            <div
              className={cn(
                "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
                "text-gray-400 transition-colors duration-200",
                isFocused && "text-emerald-500"
              )}
            >
              {rightIcon}
            </div>
          )}

          {/* Focus glow bar at bottom */}
          <motion.div
            className={cn(
              "absolute -bottom-px left-1/2 h-0.5 rounded-full",
              error
                ? "bg-gradient-to-r from-red-500 to-rose-500"
                : "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
            )}
            initial={false}
            animate={{
              width: isFocused ? "90%" : "0%",
              x: "-50%",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Error / helper text */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              id={`${id}-error`}
              className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              role="alert"
            >
              <svg
                className="h-3 w-3 shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 6.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              {error}
            </motion.p>
          ) : helperText ? (
            <motion.p
              key="helper"
              id={`${id}-helper`}
              className="mt-1.5 text-xs text-gray-400 dark:text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputSizeVariants };
