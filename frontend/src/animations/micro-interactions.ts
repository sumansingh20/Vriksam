/**
 * Premium micro-interactions for VRIKSHAM platform
 * Subtle, polished animations for buttons, cards, and interactive elements
 */

import type { Variants, Transition } from 'framer-motion';

/* -------------------------------------------------------------------------- */
/*  Button Interactions                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Premium button press animation with lift on hover
 */
export const buttonPress: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  pressed: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
};

/**
 * Subtle button with glow effect on hover
 */
export const buttonGlow: Variants = {
  rest: {
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)',
  },
  hover: {
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25), 0 0 30px rgba(16, 185, 129, 0.08)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Card Interactions                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Premium card lift with shadow enhancement
 */
export const cardLift: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    y: -6,
    scale: 1.01,
    boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.15)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Subtle card hover with border glow
 */
export const cardGlow: Variants = {
  rest: {
    borderColor: 'rgba(16, 185, 129, 0.1)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  hover: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.12)',
    transition: {
      duration: 0.25,
    },
  },
};

/**
 * Card with scale and opacity effect
 */
export const cardScale: Variants = {
  rest: {
    scale: 1,
    opacity: 0.95,
  },
  hover: {
    scale: 1.03,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Icon Interactions                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Icon bounce on hover
 */
export const iconBounce: Variants = {
  rest: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    rotate: [0, -5, 5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

/**
 * Icon rotation animation
 */
export const iconRotate: Variants = {
  rest: {
    rotate: 0,
  },
  hover: {
    rotate: 360,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/**
 * Icon pulse effect
 */
export const iconPulse: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Loading States                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Shimmer loading effect
 */
export const shimmerEffect: Variants = {
  initial: {
    x: '-100%',
  },
  animate: {
    x: '100%',
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

/**
 * Skeleton pulse loading
 */
export const skeletonPulse: Variants = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

/**
 * Spinner rotation
 */
export const spinnerRotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Input Interactions                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Input focus with border glow
 */
export const inputFocus: Variants = {
  unfocused: {
    borderColor: 'rgba(209, 213, 219, 1)',
    boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)',
  },
  focused: {
    borderColor: 'rgba(16, 185, 129, 1)',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
    transition: {
      duration: 0.2,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Badge & Chip Interactions                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Badge hover scale
 */
export const badgeHover: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Transition Presets                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Smooth spring transition
 */
export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

/**
 * Snappy spring transition
 */
export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

/**
 * Gentle easing
 */
export const gentleEase: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

/**
 * Quick fade
 */
export const quickFade: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};

/* -------------------------------------------------------------------------- */
/*  Utility Functions                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Create a stagger delay for list items
 */
export function createStaggerDelay(index: number, baseDelay = 0.05): number {
  return index * baseDelay;
}

/**
 * Create hover transition with custom duration
 */
export function createHoverTransition(duration = 0.3): Transition {
  return {
    duration,
    ease: [0.22, 1, 0.36, 1],
  };
}
