'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '@/components/layout/page-header';
import { TrendingUp, Users, Sprout, Star } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const revenueData = [
  { month: 'Jan', revenue: 42, lastYear: 35 },
  { month: 'Feb', revenue: 48, lastYear: 38 },
  { month: 'Mar', revenue: 55, lastYear: 42 },
  { month: 'Apr', revenue: 51, lastYear: 45 },
  { month: 'May', revenue: 62, lastYear: 48 },
  { month: 'Jun', revenue: 68, lastYear: 52 },
  { month: 'Jul', revenue: 72, lastYear: 56 },
  { month: 'Aug', revenue: 78, lastYear: 60 },
  { month: 'Sep', revenue: 74, lastYear: 58 },
  { month: 'Oct', revenue: 82, lastYear: 64 },
  { month: 'Nov', revenue: 88, lastYear: 68 },
  { month: 'Dec', revenue: 95, lastYear: 72 },
];

const plantHealthData = [
  { name: 'Healthy', value: 284, color: '#10b981' },
  { name: 'Needs Attention', value: 47, color: '#f59e0b' },
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'Replaced', value: 8, color: '#8b5cf6' },
];

const maintenanceEfficiency = [
  { month: 'Jan', onTime: 92, delayed: 8 },
  { month: 'Feb', onTime: 88, delayed: 12 },
  { month: 'Mar', onTime: 95, delayed: 5 },
  { month: 'Apr', onTime: 91, delayed: 9 },
  { month: 'May', onTime: 97, delayed: 3 },
  { month: 'Jun', onTime: 94, delayed: 6 },
  { month: 'Jul', onTime: 96, delayed: 4 },
  { month: 'Aug', onTime: 93, delayed: 7 },
  { month: 'Sep', onTime: 98, delayed: 2 },
  { month: 'Oct', onTime: 95, delayed: 5 },
  { month: 'Nov', onTime: 97, delayed: 3 },
  { month: 'Dec', onTime: 96, delayed: 4 },
];

const customerGrowth = [
  { month: 'Jan', clients: 180, churned: 5 },
  { month: 'Feb', clients: 195, churned: 3 },
  { month: 'Mar', clients: 210, churned: 4 },
  { month: 'Apr', clients: 205, churned: 8 },
  { month: 'May', clients: 220, churned: 2 },
  { month: 'Jun', clients: 235, churned: 3 },
  { month: 'Jul', clients: 240, churned: 5 },
  { month: 'Aug', clients: 248, churned: 4 },
];

const topTechnicians = [
  { name: 'Priya Sharma', rating: 4.9, visits: 156, satisfaction: 98 },
  { name: 'Anita Desai', rating: 4.9, visits: 148, satisfaction: 97 },
  { name: 'Raj Patel', rating: 4.8, visits: 142, satisfaction: 96 },
  { name: 'Deepak Nair', rating: 4.8, visits: 138, satisfaction: 95 },
  { name: 'Sneha Reddy', rating: 4.7, visits: 134, satisfaction: 94 },
];

/* -------------------------------------------------------------------------- */
/*  Chart Card Wrapper                                                        */
/* -------------------------------------------------------------------------- */

function ChartCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Comprehensive insights into your green infrastructure performance."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Analytics' },
        ]}
      />

      {/* Revenue trends - full width */}
      <ChartCard title="Revenue Trends" subtitle="Monthly revenue vs last year (in thousands)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="lastYearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v: number) => `${v}k`} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" name="This Year" />
              <Area type="monotone" dataKey="lastYear" stroke="#8b5cf6" strokeWidth={2} fill="url(#lastYearGrad)" name="Last Year" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plant health distribution */}
        <ChartCard title="Plant Health Distribution" subtitle="Current status breakdown">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plantHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {plantHealthData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {plantHealthData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Maintenance efficiency */}
        <ChartCard title="Maintenance Efficiency" subtitle="On-time vs delayed visits (%)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip />
                <Bar dataKey="onTime" fill="#10b981" radius={[4, 4, 0, 0]} name="On Time %" />
                <Bar dataKey="delayed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Delayed %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer growth */}
        <ChartCard title="Customer Growth" subtitle="New clients and churn over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip />
                <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} name="Total Clients" />
                <Line type="monotone" dataKey="churned" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} name="Churned" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Top technicians */}
        <ChartCard title="Top Performing Technicians" subtitle="Based on ratings and completed visits">
          <div className="space-y-3">
            {topTechnicians.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  #{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{tech.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {tech.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      {tech.visits} visits
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {tech.satisfaction}%
                  </span>
                  <p className="text-[10px] text-gray-400">satisfaction</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Summary cards */}
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white">+32%</p>
            <p className="text-xs text-gray-500">Revenue Growth YoY</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
            <Users className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">96.2%</p>
            <p className="text-xs text-gray-500">Client Retention Rate</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
            <Sprout className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">81%</p>
            <p className="text-xs text-gray-500">Plants in Healthy State</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
