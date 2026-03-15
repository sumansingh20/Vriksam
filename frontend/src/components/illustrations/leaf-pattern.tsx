'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeafPatternProps {
  className?: string;
}

interface LeafConfig {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  driftX: number;
  driftY: number;
  driftRotation: number;
  duration: number;
  delay: number;
}

const leaves: LeafConfig[] = [
  { x: 45, y: 35, scale: 1, rotation: -20, opacity: 0.07, driftX: 3, driftY: 2, driftRotation: 5, duration: 12, delay: 0 },
  { x: 160, y: 55, scale: 0.7, rotation: 45, opacity: 0.05, driftX: -2, driftY: 3, driftRotation: -4, duration: 14, delay: 1 },
  { x: 310, y: 30, scale: 0.85, rotation: -60, opacity: 0.06, driftX: 2, driftY: -2, driftRotation: 6, duration: 11, delay: 2 },
  { x: 80, y: 140, scale: 0.6, rotation: 15, opacity: 0.08, driftX: -3, driftY: 2, driftRotation: -5, duration: 13, delay: 0.5 },
  { x: 240, y: 120, scale: 1.1, rotation: -35, opacity: 0.06, driftX: 3, driftY: -3, driftRotation: 4, duration: 15, delay: 1.5 },
  { x: 370, y: 150, scale: 0.5, rotation: 70, opacity: 0.07, driftX: -2, driftY: 2, driftRotation: -6, duration: 10, delay: 3 },
  { x: 30, y: 250, scale: 0.75, rotation: -80, opacity: 0.05, driftX: 2, driftY: 3, driftRotation: 5, duration: 14, delay: 2.5 },
  { x: 190, y: 230, scale: 0.9, rotation: 25, opacity: 0.08, driftX: -3, driftY: -2, driftRotation: -3, duration: 12, delay: 0.8 },
  { x: 330, y: 260, scale: 0.65, rotation: -45, opacity: 0.06, driftX: 3, driftY: 2, driftRotation: 7, duration: 13, delay: 1.8 },
  { x: 120, y: 320, scale: 0.8, rotation: 55, opacity: 0.07, driftX: -2, driftY: -3, driftRotation: -4, duration: 11, delay: 3.2 },
  { x: 280, y: 340, scale: 1.05, rotation: -15, opacity: 0.05, driftX: 2, driftY: 3, driftRotation: 5, duration: 15, delay: 0.3 },
  { x: 60, y: 370, scale: 0.55, rotation: 80, opacity: 0.06, driftX: -3, driftY: -2, driftRotation: -6, duration: 14, delay: 2.2 },
  { x: 350, y: 360, scale: 0.7, rotation: -70, opacity: 0.08, driftX: 3, driftY: 2, driftRotation: 4, duration: 10, delay: 1.2 },
  { x: 200, y: 380, scale: 0.45, rotation: 30, opacity: 0.05, driftX: -2, driftY: 3, driftRotation: -5, duration: 13, delay: 3.5 },
  { x: 380, y: 80, scale: 0.6, rotation: -25, opacity: 0.07, driftX: 2, driftY: -2, driftRotation: 3, duration: 12, delay: 0.7 },
  { x: 15, y: 180, scale: 0.5, rotation: 40, opacity: 0.06, driftX: -2, driftY: 2, driftRotation: -4, duration: 14, delay: 2.8 },
];

function LeafShape({ leaf }: { leaf: LeafConfig }) {
  return (
    <motion.g
      animate={{
        x: [-leaf.driftX, leaf.driftX, -leaf.driftX],
        y: [-leaf.driftY, leaf.driftY, -leaf.driftY],
        rotate: [
          leaf.rotation - leaf.driftRotation,
          leaf.rotation + leaf.driftRotation,
          leaf.rotation - leaf.driftRotation,
        ],
      }}
      transition={{
        duration: leaf.duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: leaf.delay,
      }}
      style={{
        originX: `${leaf.x}px`,
        originY: `${leaf.y}px`,
      }}
    >
      <g
        transform={`translate(${leaf.x}, ${leaf.y}) scale(${leaf.scale}) rotate(${leaf.rotation})`}
      >
        {/* Main leaf body */}
        <path
          d="M0 0 C-8 -12, -6 -28, 0 -38 C6 -28, 8 -12, 0 0Z"
          fill="#10b981"
          opacity={leaf.opacity}
        />
        {/* Central vein */}
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={-36}
          stroke="#059669"
          strokeWidth={0.6}
          opacity={leaf.opacity * 0.7}
        />
        {/* Side veins */}
        <line
          x1={0}
          y1={-10}
          x2={-4}
          y2={-16}
          stroke="#059669"
          strokeWidth={0.4}
          opacity={leaf.opacity * 0.5}
        />
        <line
          x1={0}
          y1={-10}
          x2={4}
          y2={-16}
          stroke="#059669"
          strokeWidth={0.4}
          opacity={leaf.opacity * 0.5}
        />
        <line
          x1={0}
          y1={-20}
          x2={-5}
          y2={-26}
          stroke="#059669"
          strokeWidth={0.4}
          opacity={leaf.opacity * 0.5}
        />
        <line
          x1={0}
          y1={-20}
          x2={5}
          y2={-26}
          stroke="#059669"
          strokeWidth={0.4}
          opacity={leaf.opacity * 0.5}
        />
      </g>
    </motion.g>
  );
}

export function LeafPattern({ className }: LeafPatternProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      {leaves.map((leaf, i) => (
        <LeafShape key={i} leaf={leaf} />
      ))}
    </svg>
  );
}
