'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EcosystemProps {
  className?: string;
}

export function Ecosystem({ className }: EcosystemProps) {
  const floatAnimation = (delay: number, y: number = 4) => ({
    y: [-y, y, -y],
    transition: {
      duration: 5 + delay,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay,
    },
  });

  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      {/* Connection paths (behind everything) */}
      <motion.path
        d="M120 85 C90 75, 60 80, 45 105"
        stroke="#34d399"
        strokeWidth={1.5}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      />
      <motion.path
        d="M120 85 C150 75, 185 80, 195 105"
        stroke="#34d399"
        strokeWidth={1.5}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      />
      <motion.path
        d="M120 85 C110 100, 80 130, 70 145"
        stroke="#34d399"
        strokeWidth={1.5}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      />
      <motion.path
        d="M120 85 C135 100, 165 130, 175 145"
        stroke="#34d399"
        strokeWidth={1.5}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      />

      {/* Flowing dots on connection path 1 (left top) */}
      <motion.circle
        r={2.5}
        fill="#34d399"
        animate={{
          cx: [120, 105, 85, 65, 45],
          cy: [85, 78, 76, 82, 105],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0 }}
      />
      {/* Flowing dots on connection path 2 (right top) */}
      <motion.circle
        r={2.5}
        fill="#34d399"
        animate={{
          cx: [120, 138, 160, 180, 195],
          cy: [85, 78, 76, 84, 105],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.8 }}
      />
      {/* Flowing dots on connection path 3 (left bottom) */}
      <motion.circle
        r={2.5}
        fill="#34d399"
        animate={{
          cx: [120, 112, 95, 80, 70],
          cy: [85, 95, 115, 132, 145],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.5 }}
      />
      {/* Flowing dots on connection path 4 (right bottom) */}
      <motion.circle
        r={2.5}
        fill="#34d399"
        animate={{
          cx: [120, 130, 148, 162, 175],
          cy: [85, 97, 118, 134, 145],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 2.2 }}
      />

      {/* Central tree */}
      <motion.g animate={floatAnimation(0, 2)}>
        {/* Trunk */}
        <path
          d="M120 130 L120 88"
          stroke="#059669"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Left branch */}
        <path
          d="M120 100 L108 88"
          stroke="#059669"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Right branch */}
        <path
          d="M120 95 L134 83"
          stroke="#059669"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Canopy - layered circles */}
        <circle cx={120} cy={70} r={18} fill="#10b981" opacity={0.8} />
        <circle cx={108} cy={76} r={13} fill="#059669" opacity={0.7} />
        <circle cx={134} cy={74} r={14} fill="#047857" opacity={0.7} />
        <circle cx={120} cy={60} r={12} fill="#10b981" opacity={0.6} />
        {/* Central glow */}
        <circle cx={120} cy={70} r={6} fill="#34d399" opacity={0.3} />
      </motion.g>

      {/* Small plant 1 - top left */}
      <motion.g animate={floatAnimation(0.5, 3)}>
        <path
          d="M45 120 L45 108"
          stroke="#059669"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M45 112 C38 106, 30 104, 28 98 C33 102, 40 106, 45 112Z"
          fill="#10b981"
        />
        <path
          d="M45 108 C52 102, 58 96, 56 90 C54 94, 50 100, 45 108Z"
          fill="#059669"
        />
        <circle cx={45} cy={105} r={8} fill="#10b981" opacity={0.15} />
      </motion.g>

      {/* Small plant 2 - top right */}
      <motion.g animate={floatAnimation(1.2, 3)}>
        <path
          d="M195 118 L195 106"
          stroke="#047857"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M195 110 C188 104, 182 100, 180 94 C184 98, 190 104, 195 110Z"
          fill="#059669"
        />
        <path
          d="M195 106 C202 100, 210 98, 212 92 C208 96, 200 102, 195 106Z"
          fill="#10b981"
        />
        <path
          d="M195 108 C198 100, 196 92, 194 86 C195 92, 196 100, 195 108Z"
          fill="#047857"
        />
        <circle cx={195} cy={103} r={8} fill="#10b981" opacity={0.15} />
      </motion.g>

      {/* Small plant 3 - bottom left */}
      <motion.g animate={floatAnimation(0.8, 3)}>
        <path
          d="M70 160 L70 148"
          stroke="#059669"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M70 152 C62 146, 56 142, 52 136 C58 140, 64 146, 70 152Z"
          fill="#10b981"
        />
        <path
          d="M70 148 C76 140, 74 132, 72 126 C73 132, 73 140, 70 148Z"
          fill="#047857"
        />
        <circle cx={70} cy={145} r={8} fill="#10b981" opacity={0.15} />
      </motion.g>

      {/* Small plant 4 - bottom right */}
      <motion.g animate={floatAnimation(1.5, 3)}>
        <path
          d="M175 158 L175 146"
          stroke="#047857"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M175 150 C182 144, 188 140, 192 134 C186 138, 180 144, 175 150Z"
          fill="#059669"
        />
        <path
          d="M175 146 C168 140, 162 136, 158 130 C164 134, 170 140, 175 146Z"
          fill="#10b981"
        />
        <circle cx={175} cy={143} r={8} fill="#10b981" opacity={0.15} />
      </motion.g>

      {/* Node circles at each plant */}
      <motion.circle
        cx={45}
        cy={108}
        r={3}
        fill="#34d399"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      />
      <motion.circle
        cx={195}
        cy={108}
        r={3}
        fill="#34d399"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.circle
        cx={70}
        cy={148}
        r={3}
        fill="#34d399"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.circle
        cx={175}
        cy={148}
        r={3}
        fill="#34d399"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.circle
        cx={120}
        cy={85}
        r={4}
        fill="#34d399"
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Soft teal ambient circles */}
      <circle cx={120} cy={100} r={50} fill="#0d9488" opacity={0.04} />
      <circle cx={120} cy={100} r={80} fill="#0d9488" opacity={0.02} />
    </svg>
  );
}
