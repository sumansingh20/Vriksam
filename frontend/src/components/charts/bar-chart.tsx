'use client';

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface BarChartProps {
  /** Array of data objects to render */
  data: Record<string, any>[];
  /** Key(s) in each data object for the bar values; string for single bar, array for multiple */
  dataKey: string | string[];
  /** Key in each data object for x-axis labels (default: "name") */
  xAxisKey?: string;
  /** Colors for each bar series. Defaults to green shades */
  colors?: string[];
  /** Chart height in pixels (default: 300) */
  height?: number;
  /** Show background cartesian grid lines (default: true) */
  showGrid?: boolean;
  /** Show tooltip on hover (default: true) */
  showTooltip?: boolean;
  /** Stack the bars on top of each other (default: false) */
  stacked?: boolean;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Default Colors - Green / Emerald Palette                                   */
/* -------------------------------------------------------------------------- */

const DEFAULT_BAR_COLORS = [
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  '#059669', // emerald-600
  '#6ee7b7', // emerald-300
  '#047857', // emerald-700
];

/* -------------------------------------------------------------------------- */
/*  Custom Glassmorphism Tooltip                                               */
/* -------------------------------------------------------------------------- */

interface TooltipPayloadItem {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

function BarChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/80">
      <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
            {entry.name}:
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {typeof entry.value === 'number'
              ? entry.value.toLocaleString('en-IN')
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BarChart Component                                                         */
/* -------------------------------------------------------------------------- */

export function BarChart({
  data,
  dataKey,
  xAxisKey = 'name',
  colors = DEFAULT_BAR_COLORS,
  height = 300,
  showGrid = true,
  showTooltip = true,
  stacked = false,
  className,
}: BarChartProps) {
  // Normalize dataKey to always be an array
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const stackId = stacked ? 'stack' : undefined;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          barCategoryGap="20%"
        >
          <defs>
            {dataKeys.map((key, index) => {
              const barColor = colors[index % colors.length];
              return (
                <linearGradient
                  key={key}
                  id={`bar-gradient-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={barColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={barColor} stopOpacity={0.7} />
                </linearGradient>
              );
            })}
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200/40 dark:text-gray-700/40"
              vertical={false}
            />
          )}

          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            dy={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            dx={-4}
          />

          {showTooltip && (
            <Tooltip
              content={<BarChartTooltip />}
              cursor={{ fill: 'currentColor', className: 'text-gray-100/50 dark:text-gray-800/50' }}
            />
          )}

          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`url(#bar-gradient-${key})`}
              radius={[4, 4, 0, 0] as [number, number, number, number]}
              stackId={stackId}
              animationDuration={1200}
              animationBegin={index * 150}
              animationEasing="ease-in-out"
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;
