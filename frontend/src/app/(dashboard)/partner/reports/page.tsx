'use client';

import { motion } from 'framer-motion';
import {
  IndianRupee,
  Heart,
  Star,
  CloudRain,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const topStats = [
  { label: 'Revenue', value: '\u20B912,48,000', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-500/10', change: '+12.3%' },
  { label: 'Plant Survival Rate', value: '96.2%', icon: Heart, color: 'text-green-600', bg: 'bg-green-500/10', change: '+1.8%' },
  { label: 'Client Satisfaction', value: '4.7/5', icon: Star, color: 'text-amber-600', bg: 'bg-amber-500/10', change: '+0.3' },
  { label: 'Carbon Offset', value: '2,400 kg', icon: CloudRain, color: 'text-sky-600', bg: 'bg-sky-500/10', change: '+15.2%' },
];

const revenueData = [
  { month: 'Oct', revenue: 980000 },
  { month: 'Nov', revenue: 1050000 },
  { month: 'Dec', revenue: 1120000 },
  { month: 'Jan', revenue: 1080000 },
  { month: 'Feb', revenue: 1180000 },
  { month: 'Mar', revenue: 1248000 },
];

const plantHealthData = [
  { name: 'Healthy', value: 1684, color: '#10b981' },
  { name: 'Needs Attention', value: 128, color: '#f59e0b' },
  { name: 'Critical', value: 35, color: '#ef4444' },
];

const maintenanceCompletionData = [
  { week: 'W1', scheduled: 28, completed: 26 },
  { week: 'W2', scheduled: 32, completed: 31 },
  { week: 'W3', scheduled: 30, completed: 28 },
  { week: 'W4', scheduled: 35, completed: 34 },
  { week: 'W5', scheduled: 28, completed: 27 },
  { week: 'W6', scheduled: 33, completed: 32 },
];

const clientGrowthData = [
  { month: 'Oct', clients: 18 },
  { month: 'Nov', clients: 19 },
  { month: 'Dec', clients: 20 },
  { month: 'Jan', clients: 21 },
  { month: 'Feb', clients: 22 },
  { month: 'Mar', clients: 24 },
];

/* -------------------------------------------------------------------------- */
/*  Chart Card                                                                 */
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
      className={cn(
        'rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50',
        className,
      )}
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
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PartnerReportsPage() {
  const formatRevenue = (value: number) => {
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive insights into your service operations and performance."
        breadcrumbs={[
          { label: 'Partner', href: '/dashboard/partner' },
          { label: 'Reports' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <FileText className="h-4 w-4" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <FileSpreadsheet className="h-4 w-4" />
              Download CSV
            </button>
          </div>
        }
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className="flex items-start justify-between">
                <div className={cn('inline-flex rounded-xl p-2.5', stat.bg)}>
                  <Icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Trend - Full Width */}
      <ChartCard title="Revenue Trend" subtitle="Monthly revenue over the last 6 months">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(v: number) => `\u20B9${formatRevenue(v)}`}
              />
              <Tooltip
                formatter={(value: number) => [`\u20B9${value.toLocaleString('en-IN')}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plant Health Distribution */}
        <ChartCard title="Plant Health Distribution" subtitle="Current health status breakdown">
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
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {plantHealthData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Maintenance Completion */}
        <ChartCard title="Maintenance Completion" subtitle="Weekly scheduled vs completed visits">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend />
                <Bar dataKey="scheduled" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Scheduled" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Client Growth - Full Width */}
      <ChartCard title="Client Growth" subtitle="Monthly client base growth">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={clientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              />
              <Line
                type="monotone"
                dataKey="clients"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
                name="Total Clients"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
