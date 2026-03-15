"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Types ---

type BackgroundVariant = "default" | "muted" | "dark" | "gradient" | "transparent";
type ContainerWidth = "sm" | "md" | "lg" | "xl" | "full";
type PaddingSize = "none" | "sm" | "md" | "lg" | "xl";

interface SectionProps {
  children: ReactNode;
  /** Background style variant */
  background?: BackgroundVariant;
  /** Maximum container width */
  containerWidth?: ContainerWidth;
  /** Vertical padding */
  padding?: PaddingSize;
  /** Additional class names for the section element */
  className?: string;
  /** Additional class names for the container */
  containerClassName?: string;
  /** Unique id for anchor linking */
  id?: string;
  /** Disable scroll-triggered animation */
  disableAnimation?: boolean;
  /** Animation delay in seconds */
  animationDelay?: number;
}

// --- Config ---

const backgroundClasses: Record<BackgroundVariant, string> = {
  default: "bg-white dark:bg-gray-950",
  muted: "bg-gray-50/80 dark:bg-gray-900/50",
  dark: "bg-gray-950 text-white dark:bg-gray-950",
  gradient:
    "bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-950 dark:via-emerald-950/10 dark:to-gray-950",
  transparent: "bg-transparent",
};

const containerWidthClasses: Record<ContainerWidth, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

const paddingClasses: Record<PaddingSize, string> = {
  none: "py-0",
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-24 lg:py-32",
  xl: "py-24 sm:py-32 lg:py-40",
};

// --- Variants ---

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// --- Component ---

export function Section({
  children,
  background = "default",
  containerWidth = "lg",
  padding = "md",
  className,
  containerClassName,
  id,
  disableAnimation = false,
  animationDelay = 0,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -80px 0px",
  });

  const content = (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerWidthClasses[containerWidth],
        containerClassName
      )}
    >
      {children}
    </div>
  );

  if (disableAnimation) {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "relative overflow-hidden",
          backgroundClasses[background],
          paddingClasses[padding],
          className
        )}
      >
        {content}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: animationDelay }}
      className={cn(
        "relative overflow-hidden",
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      {content}
    </motion.section>
  );
}

// --- Section Title Helper ---

interface SectionTitleProps {
  /** Pill / eyebrow text above the heading */
  eyebrow?: string;
  /** Main heading */
  title: string;
  /** Description text */
  description?: string;
  /** Center align (default: true) */
  centered?: boolean;
  /** Additional class names */
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  centered = true,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("mb-12 lg:mb-16", centered && "text-center", className)}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={cn("mb-4", centered && "flex justify-center")}
        >
          <span className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/50 dark:text-emerald-400">
            {eyebrow}
          </span>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className={cn(
          "text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl",
          centered && "mx-auto max-w-3xl"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            "mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg",
            centered && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
