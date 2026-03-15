'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface PlantHealthData {
  name: string;
  value: number;
  color: string;
}

interface PlantHealthChartProps {
  data?: PlantHealthData[];
}

/* -------------------------------------------------------------------------- */
/*  Default data                                                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_DATA: PlantHealthData[] = [
  { name: 'Healthy', value: 284, color: '#10b981' },
  { name: 'Needs Attention', value: 47, color: '#f59e0b' },
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'Replaced', value: 8, color: '#8b5cf6' },
];

/* -------------------------------------------------------------------------- */
/*  Custom Tooltip                                                            */
/* -------------------------------------------------------------------------- */

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: PlantHealthData;
}

function CustomTooltip({
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
    <div className="rounded-xl border border-gray-200/60 bg-white/90 px-3 py-2 shadow-elevated backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {item.name}
        </span>
      </div>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
        {item.value} plants
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Custom Legend                                                              */
/* -------------------------------------------------------------------------- */

function CustomLegend({ data, total }: { data: PlantHealthData[]; total: number }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {data.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {entry.name}
          </span>
          <span className="ml-auto text-xs font-semibold text-gray-700 dark:text-gray-300">
            {total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function PlantHealthChart({ data = DEFAULT_DATA }: PlantHealthChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Plant Health Distribution
      </h3>

      <div className="relative mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={activeIndex !== null ? 95 : 90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={1200}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  opacity={activeIndex !== null && activeIndex !== index ? 0.5 : 1}
                  style={{ transition: 'opacity 0.2s ease' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={() => null} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {total}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Plants
            </p>
          </div>
        </div>
      </div>

      <CustomLegend data={data} total={total} />
    </motion.div>
  );
}

export default PlantHealthChart;
