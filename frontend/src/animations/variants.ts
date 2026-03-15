import type { Variants, Transition } from 'framer-motion';

/* ========================================================================== */
/*  Reusable Framer Motion variant definitions for VRIKSHAM                   */
/*  All animations are nature-inspired: smooth, organic, flowing.             */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  Shared transition presets                                                 */
/* -------------------------------------------------------------------------- */

const SPRING_GENTLE: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

const SPRING_BOUNCY: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 12,
  mass: 0.6,
};

const EASE_SMOOTH: Transition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.6,
};

/* -------------------------------------------------------------------------- */
/*  Fade variants                                                             */
/* -------------------------------------------------------------------------- */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_GENTLE },
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_GENTLE },
  },
  exit: { opacity: 0, y: 15, transition: { duration: 0.25 } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING_GENTLE },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.25 } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...SPRING_GENTLE },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
};

/* -------------------------------------------------------------------------- */
/*  Slide variants                                                            */
/* -------------------------------------------------------------------------- */

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ...EASE_SMOOTH },
  },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.35 } },
};

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ...EASE_SMOOTH },
  },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.35 } },
};

export const slideInUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ...EASE_SMOOTH },
  },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.35 } },
};

export const slideInDown: Variants = {
  hidden: { y: '-100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ...EASE_SMOOTH },
  },
  exit: { y: '-100%', opacity: 0, transition: { duration: 0.35 } },
};

/* -------------------------------------------------------------------------- */
/*  Scale variants                                                            */
/* -------------------------------------------------------------------------- */

export const scaleIn: Variants = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { ...SPRING_BOUNCY },
  },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

export const scaleInCenter: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 0.8,
    },
  },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
};

/* -------------------------------------------------------------------------- */
/*  Stagger container & item                                                  */
/* -------------------------------------------------------------------------- */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING_GENTLE },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/** Creates a stagger container with a custom delay between children. */
export function createStaggerContainer(staggerDelay = 0.1, initialDelay = 0): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerDelay * 0.5,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Page transition                                                           */
/* -------------------------------------------------------------------------- */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.3,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Card hover interaction                                                    */
/* -------------------------------------------------------------------------- */

export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  hover: {
    scale: 1.03,
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/* -------------------------------------------------------------------------- */
/*  Floating animation (CSS-like infinite float)                              */
/* -------------------------------------------------------------------------- */

export const floatingAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Morphing shape (for blob / organic shape transitions)                     */
/* -------------------------------------------------------------------------- */

export const morphingShape: Variants = {
  initial: {
    borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
    scale: 1,
  },
  animate: {
    borderRadius: [
      '40% 60% 60% 40% / 60% 40% 60% 40%',
      '60% 40% 40% 60% / 40% 60% 40% 60%',
      '50% 50% 40% 60% / 55% 45% 55% 45%',
      '40% 60% 60% 40% / 60% 40% 60% 40%',
    ],
    scale: [1, 1.02, 0.98, 1],
    transition: {
      duration: 8,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf fall animation                                                       */
/* -------------------------------------------------------------------------- */

export const leafFall: Variants = {
  initial: {
    y: -20,
    x: 0,
    rotate: 0,
    opacity: 0,
  },
  animate: {
    y: ['-5vh', '105vh'],
    x: [0, 30, -20, 40, 10],
    rotate: [0, 45, -30, 60, 15],
    opacity: [0, 1, 1, 1, 0],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
      times: [0, 0.1, 0.5, 0.9, 1],
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Counter animation (for number count-up effect via variant key-frames)     */
/* -------------------------------------------------------------------------- */

export const counter: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Utility: create a custom delay wrapper around any variant                 */
/* -------------------------------------------------------------------------- */

export function withDelay(variant: Variants, delay: number): Variants {
  const result: Variants = {};
  for (const [key, value] of Object.entries(variant)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const v = value as Record<string, unknown>;
      const existingTransition = (v.transition ?? {}) as Record<string, unknown>;
      result[key] = {
        ...v,
        transition: {
          ...existingTransition,
          delay: ((existingTransition.delay as number) ?? 0) + delay,
        },
      };
    } else {
      result[key] = value;
    }
  }
  return result;
}
