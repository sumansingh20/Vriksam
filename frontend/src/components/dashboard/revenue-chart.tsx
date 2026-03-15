'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface RevenueDataPoint {
  name: string;
  revenue: number;
  expenses?: number;
}

interface RevenueChartProps {
  data?: RevenueDataPoint[];
}

type ViewMode = 'monthly' | 'quarterly' | 'annual';
type ChartType = 'line' | 'bar';

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const MONTHLY_DATA: RevenueDataPoint[] = [
  { name: 'Jan', revenue: 42000, expenses: 28000 },
  { name: 'Feb', revenue: 48000, expenses: 30000 },
  { name: 'Mar', revenue: 55000, expenses: 32000 },
  { name: 'Apr', revenue: 51000, expenses: 29000 },
  { name: 'May', revenue: 62000, expenses: 35000 },
  { name: 'Jun', revenue: 68000, expenses: 38000 },
  { name: 'Jul', revenue: 72000, expenses: 40000 },
  { name: 'Aug', revenue: 78000, expenses: 42000 },
  { name: 'Sep', revenue: 74000, expenses: 39000 },
  { name: 'Oct', revenue: 82000, expenses: 44000 },
  { name: 'Nov', revenue: 88000, expenses: 46000 },
  { name: 'Dec', revenue: 95000, expenses: 50000 },
];

const QUARTERLY_DATA: RevenueDataPoint[] = [
  { name: 'Q1', revenue: 145000, expenses: 90000 },
  { name: 'Q2', revenue: 181000, expenses: 102000 },
  { name: 'Q3', revenue: 224000, expenses: 121000 },
  { name: 'Q4', revenue: 265000, expenses: 140000 },
];

const ANNUAL_DATA: RevenueDataPoint[] = [
  { name: '2022', revenue: 520000, expenses: 340000 },
  { name: '2023', revenue: 680000, expenses: 410000 },
  { name: '2024', revenue: 815000, expenses: 453000 },
  { name: '2025', revenue: 950000, expenses: 520000 },
];

const DATA_MAP: Record<ViewMode, RevenueDataPoint[]> = {
  monthly: MONTHLY_DATA,
  quarterly: QUARTERLY_DATA,
  annual: ANNUAL_DATA,
};

/* -------------------------------------------------------------------------- */
/*  Custom Tooltip                                                            */
/* -------------------------------------------------------------------------- */

interface ChartTooltipPayload {
  value: number;
  name: string;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white/90 px-4 py-3 shadow-elevated backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90">
      <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {entry.name}:
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            ${(entry.value / 1000).toFixed(0)}k
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function RevenueChart({ data }: RevenueChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [chartType, setChartType] = useState<ChartType>('line');

  const chartData = data ?? DATA_MAP[viewMode];

  const viewModes: { key: ViewMode; label: string }[] = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'annual', label: 'Annual' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Revenue Overview
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Track your revenue and expenses
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex rounded-lg border border-gray-200/80 bg-gray-50/80 p-0.5 dark:border-white/10 dark:bg-white/5">
            {viewModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200',
                  viewMode === mode.key
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Chart type toggle */}
          <div className="flex rounded-lg border border-gray-200/80 bg-gray-50/80 p-0.5 dark:border-white/10 dark:bg-white/5">
            <button
              onClick={() => setChartType('line')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200',
                chartType === 'line'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              )}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200',
                chartType === 'bar'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              )}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#expenseGradient)"
                animationDuration={1500}
                animationBegin={300}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
              />
              <Bar
                dataKey="expenses"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
                animationBegin={200}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}

export default RevenueChart;
