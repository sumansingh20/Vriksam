'use client';

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface LineConfig {
  /** Key in each data object for this line's values */
  dataKey: string;
  /** Stroke color for this line */
  color: string;
  /** Display name for the tooltip / legend (defaults to dataKey) */
  name?: string;
}

export interface LineChartProps {
  /** Array of data objects to render */
  data: Record<string, any>[];
  /** Configuration for each line to render */
  lines: LineConfig[];
  /** Key in each data object for x-axis labels (default: "name") */
  xAxisKey?: string;
  /** Chart height in pixels (default: 300) */
  height?: number;
  /** Show background cartesian grid lines (default: true) */
  showGrid?: boolean;
  /** Show dot markers on each data point (default: false; dots always show on hover) */
  showDots?: boolean;
  /** Show tooltip on hover (default: true) */
  showTooltip?: boolean;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Default Line Colors - Green / Emerald Palette                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_LINE_COLORS = [
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

function LineChartTooltip({
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
/*  Custom Active Dot                                                          */
/* -------------------------------------------------------------------------- */

interface ActiveDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
}

function ActiveDot({ cx, cy, fill }: ActiveDotProps) {
  if (cx == null || cy == null) return null;

  return (
    <g>
      {/* Outer glow ring */}
      <circle cx={cx} cy={cy} r={8} fill={fill} opacity={0.2} />
      {/* Inner dot */}
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={fill}
        stroke="#fff"
        strokeWidth={2}
      />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  LineChart Component                                                        */
/* -------------------------------------------------------------------------- */

export function LineChart({
  data,
  lines,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showDots = false,
  showTooltip = true,
  className,
}: LineChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
        >
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
              content={<LineChartTooltip />}
              cursor={{
                stroke: '#9ca3af',
                strokeWidth: 1,
                strokeDasharray: '4 4',
                strokeOpacity: 0.4,
              }}
            />
          )}

          {lines.map((line, index) => {
            const lineColor =
              line.color ?? DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length];

            return (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name ?? line.dataKey}
                stroke={lineColor}
                strokeWidth={2.5}
                dot={
                  showDots
                    ? {
                        r: 3,
                        fill: lineColor,
                        stroke: '#fff',
                        strokeWidth: 2,
                      }
                    : false
                }
                activeDot={<ActiveDot fill={lineColor} />}
                animationDuration={1500}
                animationBegin={index * 200}
                animationEasing="ease-in-out"
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
