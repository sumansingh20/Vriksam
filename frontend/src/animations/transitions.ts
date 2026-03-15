import type { Variants, Transition } from 'framer-motion';

/* ========================================================================== */
/*  Page transition configurations for VRIKSHAM                               */
/*  Used with AnimatePresence + motion wrappers in Next.js layouts.           */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  Spring configs                                                            */
/* -------------------------------------------------------------------------- */

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 12,
  mass: 0.6,
};

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

export const springSlow: Transition = {
  type: 'spring',
  stiffness: 60,
  damping: 18,
  mass: 1,
};

/* -------------------------------------------------------------------------- */
/*  Duration presets                                                          */
/* -------------------------------------------------------------------------- */

export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1.0,
  pageTransition: 0.45,
} as const;

/* -------------------------------------------------------------------------- */
/*  Easing presets                                                            */
/* -------------------------------------------------------------------------- */

export const easings = {
  /** Smooth deceleration (nature-inspired) */
  easeOutNatural: [0.25, 0.46, 0.45, 0.94] as const,
  /** Quick start, gentle stop */
  easeOutQuart: [0.165, 0.84, 0.44, 1] as const,
  /** Acceleration curve */
  easeInQuart: [0.55, 0.06, 0.68, 0.19] as const,
  /** Smooth in-out */
  easeInOutCubic: [0.65, 0, 0.35, 1] as const,
  /** Slight overshoot for organic feel */
  backOut: [0.34, 1.56, 0.64, 1] as const,
};

/* -------------------------------------------------------------------------- */
/*  Page enter / exit variants                                                */
/* -------------------------------------------------------------------------- */

export const pageEnter: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.pageTransition,
      ease: easings.easeOutNatural as unknown as number[],
      staggerChildren: 0.06,
      when: 'beforeChildren',
    },
  },
};

export const pageExit: Variants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
    transition: {
      duration: durations.normal,
      ease: easings.easeInQuart as unknown as number[],
      staggerChildren: 0.03,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Combined page transition (for convenience)                                */
/* -------------------------------------------------------------------------- */

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.pageTransition,
      ease: easings.easeOutNatural as unknown as number[],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
    transition: {
      duration: durations.normal,
      ease: easings.easeInQuart as unknown as number[],
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Slide-based page transitions (for drawer / panel navigation)              */
/* -------------------------------------------------------------------------- */

export const pageSlideLeft: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutNatural as unknown as number[],
    },
  },
  exit: {
    x: '-30%',
    opacity: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeInQuart as unknown as number[],
    },
  },
};

export const pageSlideRight: Variants = {
  initial: { x: '-100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutNatural as unknown as number[],
    },
  },
  exit: {
    x: '30%',
    opacity: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeInQuart as unknown as number[],
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Overlay / modal transitions                                               */
/* -------------------------------------------------------------------------- */

export const overlayEnter: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: durations.fast, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast, ease: 'easeIn' },
  },
};

export const modalEnter: Variants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...springBouncy },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: durations.fast, ease: 'easeIn' },
  },
};
