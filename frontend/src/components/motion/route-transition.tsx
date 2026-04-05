'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type RouteTransitionTone = 'default' | 'marketing' | 'dashboard' | 'auth';

interface RouteTransitionProps {
  children: ReactNode;
  className?: string;
  tone?: RouteTransitionTone;
}

const ROUTE_VARIANTS: Record<RouteTransitionTone, Variants> = {
  default: {
    initial: { opacity: 0, y: 18, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -12, filter: 'blur(8px)' },
  },
  marketing: {
    initial: { opacity: 0, y: 30, scale: 0.995, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -20, scale: 0.995, filter: 'blur(10px)' },
  },
  dashboard: {
    initial: { opacity: 0, y: 16, x: 6, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -10, x: -4, filter: 'blur(6px)' },
  },
  auth: {
    initial: { opacity: 0, y: 22, scale: 0.99, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -14, scale: 0.99, filter: 'blur(8px)' },
  },
};

const ROUTE_TRANSITIONS: Record<RouteTransitionTone, { duration: number; ease: number[] }> = {
  default: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  marketing: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  dashboard: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  auth: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function RouteTransition({
  children,
  className,
  tone = 'default',
}: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={ROUTE_VARIANTS[tone]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={ROUTE_TRANSITIONS[tone]}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
