'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Download, TrendingUp, Award } from 'lucide-react';
import { ESGMetrics } from '@/components/dashboard/esg-metrics';
import { PageHeader } from '@/components/layout/page-header';

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const co2Data = [
  { month: 'Jan', absorbed: 42, industry: 30 },
  { month: 'Feb', absorbed: 48, industry: 32 },
  { month: 'Mar', absorbed: 55, industry: 33 },
  { month: 'Apr', absorbed: 51, industry: 34 },
  { month: 'May', absorbed: 58, industry: 35 },
  { month: 'Jun', absorbed: 62, industry: 36 },
  { month: 'Jul', absorbed: 68, industry: 37 },
  { month: 'Aug', absorbed: 72, industry: 38 },
  { month: 'Sep', absorbed: 70, industry: 37 },
  { month: 'Oct', absorbed: 78, industry: 39 },
  { month: 'Nov', absorbed: 82, industry: 40 },
  { month: 'Dec', absorbed: 88, industry: 41 },
];

const greenScoreData = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 74 },
  { month: 'Mar', score: 76 },
  { month: 'Apr', score: 78 },
  { month: 'May', score: 80 },
  { month: 'Jun', score: 82 },
  { month: 'Jul', score: 83 },
  { month: 'Aug', score: 85 },
  { month: 'Sep', score: 84 },
  { month: 'Oct', score: 86 },
  { month: 'Nov', score: 87 },
  { month: 'Dec', score: 87 },
];

/* -------------------------------------------------------------------------- */
/*  Chart Card                                                                */
/* -------------------------------------------------------------------------- */

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ClientESGPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ESG Impact Dashboard"
        description="Track your environmental, social, and governance contributions through green infrastructure."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'ESG Impact' },
        ]}
        actions={
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
            <Download className="h-4 w-4" />
            Download Report
          </button>
        }
      />

      {/* ESG Metric Cards */}
      <ESGMetrics />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CO2 Absorption */}
        <ChartCard title="CO2 Absorption" subtitle="Monthly CO2 absorbed (kg) vs industry average">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={co2Data}>
                <defs>
                  <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip />
                <Area type="monotone" dataKey="absorbed" stroke="#10b981" strokeWidth={2.5} fill="url(#co2Grad)" name="Your Plants" />
                <Area type="monotone" dataKey="industry" stroke="#9ca3af" strokeWidth={1.5} fill="none" strokeDasharray="5 5" name="Industry Avg" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-500">Your Plants</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-4 border-t-2 border-dashed border-gray-400" />
              <span className="text-xs text-gray-500">Industry Average</span>
            </div>
          </div>
        </ChartCard>

        {/* Green Score Over Time */}
        <ChartCard title="Green Score Trend" subtitle="Your environmental wellness score over time">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={greenScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                  name="Green Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Comparison stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4x</p>
            <p className="text-xs text-gray-500">Above industry CO2 absorption</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
            <Award className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Top 15%</p>
            <p className="text-xs text-gray-500">Among all Vriksham clients</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
            <TrendingUp className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">+21%</p>
            <p className="text-xs text-gray-500">Green score improvement YoY</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
