'use client';

import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface AreaChartProps {
  /** Array of data objects to render */
  data: Record<string, any>[];
  /** Key in each data object for the area values */
  dataKey: string;
  /** Key in each data object for x-axis labels (default: "name") */
  xAxisKey?: string;
  /** Stroke color for the area line (default: emerald-500) */
  color?: string;
  /** Gradient start color / top opacity color (default: matches color) */
  gradientFrom?: string;
  /** Gradient end color / bottom opacity color (default: matches gradientFrom) */
  gradientTo?: string;
  /** Chart height in pixels (default: 300) */
  height?: number;
  /** Show background cartesian grid lines (default: true) */
  showGrid?: boolean;
  /** Show tooltip on hover (default: true) */
  showTooltip?: boolean;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Custom Glassmorphism Tooltip                                               */
/* -------------------------------------------------------------------------- */

interface TooltipPayloadItem {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

function AreaChartTooltip({
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
/*  AreaChart Component                                                        */
/* -------------------------------------------------------------------------- */

export function AreaChart({
  data,
  dataKey,
  xAxisKey = 'name',
  color = '#10b981',
  gradientFrom,
  gradientTo,
  height = 300,
  showGrid = true,
  showTooltip = true,
  className,
}: AreaChartProps) {
  const gradientId = `area-gradient-${dataKey}`;
  const fillFrom = gradientFrom ?? color;
  const fillTo = gradientTo ?? fillFrom;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillFrom} stopOpacity={0.3} />
              <stop offset="100%" stopColor={fillTo} stopOpacity={0.02} />
            </linearGradient>
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
              content={<AreaChartTooltip />}
              cursor={{
                stroke: color,
                strokeWidth: 1,
                strokeDasharray: '4 4',
                strokeOpacity: 0.4,
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChart;
