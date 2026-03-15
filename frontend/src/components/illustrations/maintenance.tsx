'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MaintenanceProps {
  className?: string;
}

export function Maintenance({ className }: MaintenanceProps) {
  const dropletAnimation = (_delay: number) => ({
    y: [0, 30, 35],
    opacity: [0.9, 0.6, 0],
    scale: [1, 0.8, 0.4],
  });

  const dropletTransition = (delay: number) => ({
    duration: 1.8,
    repeat: Infinity,
    ease: 'easeIn' as const,
    delay,
    repeatDelay: 0.6,
  });

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      {/* Ground/soil area */}
      <ellipse cx={100} cy={170} rx={70} ry={8} fill="#a67232" opacity={0.2} />

      {/* Plant */}
      <g>
        {/* Stem */}
        <path
          d="M105 170 L105 115"
          stroke="#059669"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Left branch */}
        <path
          d="M105 140 L90 130"
          stroke="#059669"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Right branch */}
        <path
          d="M105 128 L120 118"
          stroke="#059669"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Left leaf */}
        <motion.path
          d="M90 130 C80 122, 68 120, 62 112 C68 118, 78 122, 90 130Z"
          fill="#10b981"
          animate={{ rotate: [-2, 3, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '90px', originY: '130px' }}
        />
        <motion.path
          d="M90 130 C82 124, 72 122, 66 116"
          stroke="#047857"
          strokeWidth={0.7}
          fill="none"
          opacity={0.4}
          animate={{ rotate: [-2, 3, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '90px', originY: '130px' }}
        />

        {/* Right leaf */}
        <motion.path
          d="M120 118 C130 110, 140 106, 146 98 C140 106, 132 112, 120 118Z"
          fill="#059669"
          animate={{ rotate: [2, -3, 2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '120px', originY: '118px' }}
        />

        {/* Top leaf cluster */}
        <motion.path
          d="M105 115 C98 105, 88 98, 84 88 C90 94, 98 102, 105 115Z"
          fill="#10b981"
          animate={{ rotate: [-1, 2, -1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '105px', originY: '115px' }}
        />
        <motion.path
          d="M105 115 C112 103, 120 96, 126 86 C118 94, 110 104, 105 115Z"
          fill="#047857"
          animate={{ rotate: [1, -2, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '105px', originY: '115px' }}
        />
      </g>

      {/* Care hand silhouette (left side, reaching toward plant) */}
      <motion.g
        animate={{ rotate: [-1, 1, -1], y: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '40px', originY: '160px' }}
      >
        {/* Palm */}
        <path
          d="M30 148 C32 140, 40 135, 50 132 L58 138 L55 150 L42 155 Z"
          fill="#a67232"
          opacity={0.6}
        />
        {/* Fingers */}
        <path
          d="M50 132 C55 126, 58 122, 62 118 C64 122, 60 128, 58 138"
          fill="#a67232"
          opacity={0.55}
        />
        <path
          d="M54 134 C60 128, 64 124, 68 120 C69 124, 65 130, 60 138"
          fill="#a67232"
          opacity={0.5}
        />
        <path
          d="M56 137 C62 132, 68 128, 72 126 C72 130, 66 135, 60 140"
          fill="#a67232"
          opacity={0.5}
        />
        {/* Thumb */}
        <path
          d="M30 148 C26 142, 24 136, 28 130 C30 136, 32 142, 36 146"
          fill="#a67232"
          opacity={0.5}
        />
      </motion.g>

      {/* Water droplets from top-right */}
      <g>
        {/* Water source (gentle arc suggesting watering) */}
        <motion.path
          d="M145 68 C140 62, 130 58, 120 60"
          stroke="#60a5fa"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          opacity={0.35}
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Droplet 1 */}
        <motion.path
          d="M122 65 C122 63, 120 60, 120 60 C120 60, 118 63, 118 65 C118 67, 119.5 68, 120 68 C120.5 68, 122 67, 122 65Z"
          fill="#60a5fa"
          opacity={0.7}
          animate={dropletAnimation(0)}
          transition={dropletTransition(0)}
        />
        {/* Droplet 2 */}
        <motion.path
          d="M130 63 C130 61, 128 58, 128 58 C128 58, 126 61, 126 63 C126 65, 127.5 66, 128 66 C128.5 66, 130 65, 130 63Z"
          fill="#60a5fa"
          opacity={0.6}
          animate={dropletAnimation(0.6)}
          transition={dropletTransition(0.6)}
        />
        {/* Droplet 3 */}
        <motion.path
          d="M115 68 C115 66, 113 63, 113 63 C113 63, 111 66, 111 68 C111 70, 112.5 71, 113 71 C113.5 71, 115 70, 115 68Z"
          fill="#60a5fa"
          opacity={0.55}
          animate={dropletAnimation(1.2)}
          transition={dropletTransition(1.2)}
        />

        {/* Small splash dots on plant */}
        <motion.circle
          cx={108}
          cy={108}
          r={1.5}
          fill="#60a5fa"
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.circle
          cx={115}
          cy={112}
          r={1}
          fill="#60a5fa"
          animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
        />
      </g>

      {/* Wrench/tool icon (top right corner) */}
      <motion.g
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '162px', originY: '52px' }}
      >
        {/* Wrench handle */}
        <rect
          x={158}
          y={45}
          width={8}
          height={28}
          rx={3}
          fill="#065f46"
          opacity={0.6}
        />
        {/* Wrench head */}
        <path
          d="M155 45 C155 38, 158 34, 162 32 C166 34, 169 38, 169 45 L166 45 C166 40, 164 37, 162 36 C160 37, 158 40, 158 45 Z"
          fill="#065f46"
          opacity={0.7}
        />
        {/* Handle grip lines */}
        <line x1={159} y1={55} x2={165} y2={55} stroke="#047857" strokeWidth={0.8} opacity={0.4} />
        <line x1={159} y1={58} x2={165} y2={58} stroke="#047857" strokeWidth={0.8} opacity={0.4} />
        <line x1={159} y1={61} x2={165} y2={61} stroke="#047857" strokeWidth={0.8} opacity={0.4} />
      </motion.g>

      {/* Small decorative dots suggesting health/vitality */}
      <motion.circle
        cx={85}
        cy={98}
        r={2}
        fill="#34d399"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={128}
        cy={105}
        r={1.5}
        fill="#34d399"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      />
    </svg>
  );
}
