'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface DonutChartDataItem {
  /** Segment label */
  name: string;
  /** Numeric value for the segment */
  value: number;
  /** Optional hex color override for this segment */
  color?: string;
}

export interface DonutChartProps {
  /** Array of data items to render as donut segments */
  data: DonutChartDataItem[];
  /** Inner radius of the donut hole (default: 60) */
  innerRadius?: number;
  /** Outer radius of the donut (default: 90) */
  outerRadius?: number;
  /** Chart height in pixels (default: 300) */
  height?: number;
  /** Show the custom legend below the chart (default: true) */
  showLegend?: boolean;
  /** Custom center label text. Defaults to showing the computed total */
  centerLabel?: string;
  /** Subtitle shown beneath the center label (default: "Total") */
  centerSubLabel?: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Default Colors - Green / Emerald Palette                                   */
/* -------------------------------------------------------------------------- */

const DEFAULT_DONUT_COLORS = [
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  '#059669', // emerald-600
  '#6ee7b7', // emerald-300
  '#047857', // emerald-700
  '#a7f3d0', // emerald-200
  '#064e3b', // emerald-900
];

/* -------------------------------------------------------------------------- */
/*  Custom Glassmorphism Tooltip                                               */
/* -------------------------------------------------------------------------- */

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: DonutChartDataItem & { fill: string };
}

function DonutChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  if (!item) return null;

  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/80">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: item.payload.fill ?? item.payload.color }}
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {item.name}
        </span>
      </div>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
        {item.value.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Custom Legend                                                               */
/* -------------------------------------------------------------------------- */

function DonutLegend({
  data,
  colors,
  total,
}: {
  data: DonutChartDataItem[];
  colors: string[];
  total: number;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
      {data.map((entry, index) => {
        const segmentColor =
          entry.color ?? colors[index % colors.length];
        const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';

        return (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: segmentColor }}
            />
            <span className="truncate text-xs text-gray-500 dark:text-gray-400">
              {entry.name}
            </span>
            <span className="ml-auto text-xs font-semibold text-gray-700 dark:text-gray-300">
              {percentage}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  DonutChart Component                                                       */
/* -------------------------------------------------------------------------- */

export function DonutChart({
  data,
  innerRadius = 60,
  outerRadius = 90,
  height = 300,
  showLegend = true,
  centerLabel,
  centerSubLabel = 'Total',
  className,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const displayLabel = centerLabel ?? total.toLocaleString('en-IN');

  // Resolve each segment's color: use item.color if provided, otherwise fall
  // back to the default palette.
  const resolvedColors = data.map(
    (item, i) => item.color ?? DEFAULT_DONUT_COLORS[i % DEFAULT_DONUT_COLORS.length] ?? '#6b7280',
  );

  return (
    <div className={cn('w-full', className)}>
      {/* Chart area */}
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={activeIndex !== null ? outerRadius + 6 : outerRadius}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-in-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={resolvedColors[index]}
                  opacity={
                    activeIndex !== null && activeIndex !== index ? 0.45 : 1
                  }
                  style={{ transition: 'opacity 0.2s ease, transform 0.2s ease' }}
                />
              ))}
            </Pie>
            <Tooltip content={<DonutChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {displayLabel}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {centerSubLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <DonutLegend data={data} colors={resolvedColors} total={total} />
      )}
    </div>
  );
}

export default DonutChart;
