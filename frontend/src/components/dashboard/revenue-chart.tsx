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

type ChartType = 'line' | 'bar';

/* -------------------------------------------------------------------------- */
/*  Custom Tooltip                                                            */
/* -------------------------------------------------------------------------- */

interface ChartTooltipPayload {
  value: number;
  name: string;
}

function getSeriesDotClass(seriesName: string): string {
  if (seriesName.toLowerCase() === 'revenue') {
    return 'bg-emerald-500';
  }

  if (seriesName.toLowerCase() === 'expenses') {
    return 'bg-violet-500';
  }

  return 'bg-gray-400';
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
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="mb-1.5 text-xs font-medium text-gray-500">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full', getSeriesDotClass(entry.name))} />
          <span className="text-xs text-gray-500 capitalize">
            {entry.name}:
          </span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{(entry.value / 1000).toFixed(0)}k
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
  const [chartType, setChartType] = useState<ChartType>('line');
  const chartData = data ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Revenue Overview
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Revenue vs expenses over time
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart type toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => setChartType('line')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200',
                chartType === 'line'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200',
                chartType === 'bar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {chartData.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">No revenue data available</p>
          <p className="mt-1 text-xs text-gray-500">Connect live billing and payment records to visualize trends.</p>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
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
                tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
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
                tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
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
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          <span className="text-xs text-gray-500">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}

export default RevenueChart;
