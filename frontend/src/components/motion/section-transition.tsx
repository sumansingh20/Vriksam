'use client';

import { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const sectionTransitionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
  },
};

const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
};

export function SectionTransition({
  children,
  className,
  delay = 0,
  distance = 26,
  duration = 0.65,
  once = true,
}: SectionTransitionProps) {
  return (
    <motion.section
      className={cn(className)}
      initial={{ opacity: 0, y: distance, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-100px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.section>
  );
}

export function RevealBlock({
  children,
  className,
  delay = 0,
  distance = 20,
  duration = 0.55,
  once = true,
}: SectionTransitionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: distance, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.08,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delayChildren, staggerChildren }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerItemVariants}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
