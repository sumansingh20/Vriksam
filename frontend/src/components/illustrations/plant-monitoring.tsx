'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlantMonitoringProps {
  className?: string;
}

export function PlantMonitoring({ className }: PlantMonitoringProps) {
  const sensorPulse = {
    scale: [1, 1.6, 1],
    opacity: [0.8, 0.2, 0.8],
  };

  const sensorTransition = (delay: number) => ({
    duration: 2.4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    delay,
  });

  const leafSway = (direction: number) => ({
    rotate: [direction * -3, direction * 3, direction * -3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  });

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      {/* Pot */}
      <path
        d="M72 155 L78 180 L122 180 L128 155 Z"
        fill="#a67232"
        opacity={0.85}
      />
      <path
        d="M68 148 L132 148 L130 158 L70 158 Z"
        fill="#8B5E3C"
        opacity={0.9}
      />
      {/* Soil surface */}
      <ellipse cx={100} cy={148} rx={32} ry={5} fill="#5C3D1E" opacity={0.6} />

      {/* Main stem */}
      <motion.g
        animate={{ rotate: [-0.5, 0.5, -0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '100px', originY: '148px' }}
      >
        <path
          d="M100 148 L100 90"
          stroke="#059669"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Left leaf (large) */}
        <motion.g
          animate={leafSway(1)}
          style={{ originX: '100px', originY: '105px' }}
        >
          <path
            d="M100 105 C85 95, 60 90, 55 78 C55 78, 70 82, 85 90 C80 85, 65 72, 62 62 C68 70, 82 84, 100 105Z"
            fill="#10b981"
          />
          <path
            d="M100 105 C85 93, 65 82, 60 72"
            stroke="#047857"
            strokeWidth={1}
            opacity={0.5}
            fill="none"
          />
        </motion.g>

        {/* Right leaf (large) */}
        <motion.g
          animate={leafSway(-1)}
          style={{ originX: '100px', originY: '98px' }}
        >
          <path
            d="M100 98 C115 88, 140 84, 145 72 C145 72, 130 76, 115 84 C120 79, 135 66, 138 56 C132 64, 118 78, 100 98Z"
            fill="#059669"
          />
          <path
            d="M100 98 C115 86, 135 76, 140 66"
            stroke="#047857"
            strokeWidth={1}
            opacity={0.5}
            fill="none"
          />
        </motion.g>

        {/* Top leaf */}
        <motion.g
          animate={leafSway(1)}
          style={{ originX: '100px', originY: '90px' }}
        >
          <path
            d="M100 90 C95 75, 85 60, 78 50 C82 55, 92 68, 100 90Z"
            fill="#10b981"
          />
          <path
            d="M100 90 C96 72, 88 58, 80 50"
            stroke="#065f46"
            strokeWidth={0.8}
            opacity={0.4}
            fill="none"
          />
        </motion.g>

        {/* Small right leaf */}
        <motion.g
          animate={leafSway(-1)}
          style={{ originX: '100px', originY: '118px' }}
        >
          <path
            d="M100 118 C110 112, 125 110, 130 104 C128 108, 118 114, 100 118Z"
            fill="#047857"
          />
        </motion.g>

        {/* Sensor dots */}
        {/* Sensor near left leaf */}
        <motion.circle
          cx={62}
          cy={78}
          r={3}
          fill="#34d399"
          animate={sensorPulse}
          transition={sensorTransition(0)}
        />
        <motion.circle
          cx={62}
          cy={78}
          r={6}
          fill="none"
          stroke="#34d399"
          strokeWidth={1}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={sensorTransition(0)}
        />

        {/* Sensor near right leaf */}
        <motion.circle
          cx={138}
          cy={72}
          r={3}
          fill="#34d399"
          animate={sensorPulse}
          transition={sensorTransition(0.8)}
        />
        <motion.circle
          cx={138}
          cy={72}
          r={6}
          fill="none"
          stroke="#34d399"
          strokeWidth={1}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={sensorTransition(0.8)}
        />

        {/* Sensor near top */}
        <motion.circle
          cx={80}
          cy={55}
          r={3}
          fill="#34d399"
          animate={sensorPulse}
          transition={sensorTransition(1.6)}
        />
        <motion.circle
          cx={80}
          cy={55}
          r={6}
          fill="none"
          stroke="#34d399"
          strokeWidth={1}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={sensorTransition(1.6)}
        />

        {/* Data flow lines */}
        <motion.path
          d="M62 78 L50 90 L40 88"
          stroke="#34d399"
          strokeWidth={1}
          strokeDasharray="4 3"
          fill="none"
          opacity={0.6}
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M138 72 L150 82 L160 80"
          stroke="#34d399"
          strokeWidth={1}
          strokeDasharray="4 3"
          fill="none"
          opacity={0.6}
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
        />
        <motion.path
          d="M80 55 L70 42 L58 44"
          stroke="#34d399"
          strokeWidth={1}
          strokeDasharray="4 3"
          fill="none"
          opacity={0.6}
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
        />

        {/* Small data endpoint squares */}
        <rect x={36} y={85} width={6} height={6} rx={1} fill="#10b981" opacity={0.5} />
        <rect x={157} y={77} width={6} height={6} rx={1} fill="#10b981" opacity={0.5} />
        <rect x={54} y={41} width={6} height={6} rx={1} fill="#10b981" opacity={0.5} />
      </motion.g>
    </svg>
  );
}
