'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  type Variants,
} from 'framer-motion';
import { fadeInUp } from './variants';

/* ========================================================================== */
/*  AnimateOnScroll                                                           */
/*  Wraps children and triggers animation when they scroll into view.         */
/* ========================================================================== */

interface AnimateOnScrollProps {
  children: ReactNode;
  /** Framer Motion variants (default: fadeInUp) */
  variants?: Variants;
  /** Viewport threshold (0-1) to trigger (default: 0.15) */
  threshold?: number;
  /** Only animate the first time it enters the viewport (default: true) */
  once?: boolean;
  /** Extra delay in seconds before triggering */
  delay?: number;
  /** CSS class for the wrapper */
  className?: string;
  /** Inline styles for the wrapper */
  style?: CSSProperties;
  /** HTML tag for the motion wrapper (default: div) */
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'span';
}

export function AnimateOnScroll({
  children,
  variants = fadeInUp,
  threshold = 0.15,
  once = true,
  delay = 0,
  className,
  style,
  as = 'div',
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      exit="exit"
      transition={delay ? { delay } : undefined}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

/* ========================================================================== */
/*  ParallaxSection                                                           */
/*  Moves children at a different speed from scroll to create depth.          */
/* ========================================================================== */

interface ParallaxSectionProps {
  children: ReactNode;
  /** Parallax speed multiplier. 0 = no parallax, 1 = full speed, negative = reverse */
  speed?: number;
  /** CSS class */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

export function ParallaxSection({
  children,
  speed = 0.3,
  className,
  style,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress [0, 1] to a Y offset based on speed
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <div ref={ref} className={className} style={{ ...style, overflow: 'hidden' }}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ========================================================================== */
/*  RevealText                                                                */
/*  Words reveal one by one as the element scrolls into view.                 */
/* ========================================================================== */

interface RevealTextProps {
  /** The text string to animate word-by-word */
  text: string;
  /** Delay between each word (default: 0.04s) */
  wordDelay?: number;
  /** Only animate once (default: true) */
  once?: boolean;
  /** CSS class for the container */
  className?: string;
  /** CSS class for individual words */
  wordClassName?: string;
  /** HTML tag for the text container */
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function RevealText({
  text,
  wordDelay = 0.04,
  once = true,
  className,
  wordClassName,
  as = 'p',
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const MotionTag = motion[as] as typeof motion.p;

  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: wordDelay,
      },
    },
  };

  return (
    <MotionTag
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}
    >
      {words.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={wordVariants} className={wordClassName}>
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}

/* ========================================================================== */
/*  CountUpNumber                                                             */
/*  Animates a number from 0 to `value` with optional formatting.             */
/* ========================================================================== */

interface CountUpNumberProps {
  /** Target value to count up to */
  value: number;
  /** Animation duration in seconds (default: 2) */
  duration?: number;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "%", "k") */
  suffix?: string;
  /** Use locale-aware thousand separators (default: true) */
  useGrouping?: boolean;
  /** Locale for formatting (default: 'en-IN') */
  locale?: string;
  /** CSS class */
  className?: string;
  /** Only animate once (default: true) */
  once?: boolean;
}

export function CountUpNumber({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  useGrouping = true,
  locale = 'en-IN',
  className,
  once = true,
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
    duration: duration * 1000,
  });

  // Format the number for display
  const format = useCallback(
    (n: number) => {
      const formatted = n.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping,
      });
      return `${prefix}${formatted}${suffix}`;
    },
    [decimals, locale, prefix, suffix, useGrouping],
  );

  // Subscribe to spring changes
  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  // Trigger the animation when in view
  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {format(displayValue)}
    </motion.span>
  );
}
