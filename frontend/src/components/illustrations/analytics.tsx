'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnalyticsProps {
  className?: string;
}

export function Analytics({ className }: AnalyticsProps) {
  const barVariants = {
    hidden: { scaleY: 0 },
    visible: (i: number) => ({
      scaleY: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const leafVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: 1.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const bars = [
    { x: 42, height: 50, color: '#10b981' },
    { x: 78, height: 72, color: '#059669' },
    { x: 114, height: 58, color: '#047857' },
    { x: 150, height: 95, color: '#10b981' },
  ];

  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      {/* Background grid lines */}
      {[40, 65, 90, 115, 140].map((y) => (
        <line
          key={y}
          x1={25}
          y1={y}
          x2={185}
          y2={y}
          stroke="#059669"
          strokeWidth={0.5}
          opacity={0.12}
        />
      ))}

      {/* Y-axis */}
      <line
        x1={30}
        y1={35}
        x2={30}
        y2={155}
        stroke="#065f46"
        strokeWidth={1.5}
        opacity={0.3}
      />
      {/* X-axis */}
      <line
        x1={30}
        y1={155}
        x2={182}
        y2={155}
        stroke="#065f46"
        strokeWidth={1.5}
        opacity={0.3}
      />

      {/* Y-axis tick labels */}
      {[
        { y: 65, label: '75' },
        { y: 90, label: '50' },
        { y: 115, label: '25' },
      ].map(({ y, label }) => (
        <text
          key={label}
          x={24}
          y={y + 3}
          textAnchor="end"
          fill="#065f46"
          fontSize={8}
          opacity={0.35}
        >
          {label}
        </text>
      ))}

      {/* Bars with staggered grow-in animation */}
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          y={155 - bar.height}
          width={26}
          height={bar.height}
          rx={4}
          fill={bar.color}
          opacity={0.85}
          custom={i}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          style={{ originY: 1, transformBox: 'fill-box' }}
        />
      ))}

      {/* Gradient overlay on bars for depth */}
      {bars.map((bar, i) => (
        <motion.rect
          key={`overlay-${i}`}
          x={bar.x}
          y={155 - bar.height}
          width={13}
          height={bar.height}
          rx={4}
          fill="white"
          opacity={0.1}
          custom={i}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          style={{ originY: 1, transformBox: 'fill-box' }}
        />
      ))}

      {/* X-axis labels */}
      {['Q1', 'Q2', 'Q3', 'Q4'].map((label, i) => (
        <text
          key={label}
          x={bars[i]!.x + 13}
          y={168}
          textAnchor="middle"
          fill="#065f46"
          fontSize={9}
          opacity={0.4}
        >
          {label}
        </text>
      ))}

      {/* Leaf sprouting from tallest bar */}
      <motion.g
        variants={leafVariants}
        initial="hidden"
        animate="visible"
        style={{ originX: '163px', originY: '60px' }}
      >
        {/* Stem */}
        <path
          d="M163 60 L163 45"
          stroke="#059669"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Leaf */}
        <motion.path
          d="M163 45 C155 38, 148 28, 146 20 C150 24, 156 32, 163 45Z"
          fill="#10b981"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '163px', originY: '45px' }}
        />
        <motion.path
          d="M163 45 C171 36, 178 28, 182 20 C176 26, 168 34, 163 45Z"
          fill="#047857"
          animate={{ rotate: [2, -2, 2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '163px', originY: '45px' }}
        />
        {/* Leaf vein */}
        <path
          d="M163 45 L155 30"
          stroke="#065f46"
          strokeWidth={0.6}
          opacity={0.3}
          fill="none"
        />
        <path
          d="M163 45 L172 30"
          stroke="#065f46"
          strokeWidth={0.6}
          opacity={0.3}
          fill="none"
        />
      </motion.g>

      {/* Subtle upward trend line */}
      <motion.path
        d="M55 130 L91 110 L127 120 L163 60"
        stroke="#34d399"
        strokeWidth={2}
        strokeDasharray="5 4"
        fill="none"
        opacity={0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Trend line dots */}
      {[
        { cx: 55, cy: 130, delay: 0.5 },
        { cx: 91, cy: 110, delay: 0.9 },
        { cx: 127, cy: 120, delay: 1.3 },
        { cx: 163, cy: 60, delay: 1.7 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r={3}
          fill="#34d399"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ delay: dot.delay, duration: 0.3 }}
        />
      ))}
    </svg>
  );
}
