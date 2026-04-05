'use client';

import { useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  HeartPulse,
  CheckCircle2,
  CloudRain,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  Loader2,
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
} from 'recharts';
import { PageHeader } from '@/components/layout/page-header';
import {
  useESGMetrics,
  useMaintenanceMetrics,
  useOverviewStats,
  usePlantMetrics,
  useRevenueData,
} from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#14b8a6'];
const DOT_CLASSES = [
  'bg-emerald-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-teal-500',
];

function formatCurrency(value: number) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function humanizeLabel(raw: string) {
  return raw
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatPeriodLabel(period: string) {
  const [year, month] = period.split('-').map(Number);
  if (!year || !month) return period;

  return new Date(year, month - 1, 1).toLocaleString('en-IN', {
    month: 'short',
  });
}

function ChartCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
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

function ChartEmpty({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 text-center dark:border-white/10">
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}

export default function PartnerReportsPage() {
  const overviewQuery = useOverviewStats();
  const revenueQuery = useRevenueData({ period: 'monthly' });
  const plantQuery = usePlantMetrics();
  const maintenanceQuery = useMaintenanceMetrics();
  const esgQuery = useESGMetrics();

  const stats = useMemo(() => {
    const monthlyRevenue =
      overviewQuery.data?.monthlyRevenue ?? revenueQuery.data?.periodRevenue ?? 0;

    return [
      {
        label: 'Monthly Revenue',
        value: formatCurrency(monthlyRevenue),
        icon: IndianRupee,
        color: 'text-emerald-600',
        bg: 'bg-emerald-500/10',
        change:
          revenueQuery.data?.revenueGrowth !== undefined
            ? `${revenueQuery.data.revenueGrowth > 0 ? '+' : ''}${revenueQuery.data.revenueGrowth.toFixed(1)}%`
            : null,
      },
      {
        label: 'Plant Survival Rate',
        value:
          plantQuery.data?.survivalRate !== undefined
            ? `${plantQuery.data.survivalRate.toFixed(1)}%`
            : '--',
        icon: HeartPulse,
        color: 'text-green-600',
        bg: 'bg-green-500/10',
        change:
          plantQuery.data?.averageHealthScore !== undefined
            ? `Score ${plantQuery.data.averageHealthScore.toFixed(1)}`
            : null,
      },
      {
        label: 'Visit Completion',
        value:
          maintenanceQuery.data?.completionRate !== undefined
            ? `${maintenanceQuery.data.completionRate.toFixed(1)}%`
            : '--',
        icon: CheckCircle2,
        color: 'text-sky-600',
        bg: 'bg-sky-500/10',
        change:
          maintenanceQuery.data?.missedVisitRate !== undefined
            ? `${maintenanceQuery.data.missedVisitRate.toFixed(1)}% missed`
            : null,
      },
      {
        label: 'CO2 Absorbed',
        value:
          esgQuery.data?.totalCO2Absorbed !== undefined
            ? `${formatCompact(esgQuery.data.totalCO2Absorbed)} g/day`
            : '--',
        icon: CloudRain,
        color: 'text-indigo-600',
        bg: 'bg-indigo-500/10',
        change:
          esgQuery.data?.carbonOffsetEquivalent !== undefined
            ? `${esgQuery.data.carbonOffsetEquivalent} tree equivalent`
            : null,
      },
    ];
  }, [
    esgQuery.data,
    maintenanceQuery.data,
    overviewQuery.data,
    plantQuery.data,
    revenueQuery.data,
  ]);

  const revenueTrendData = useMemo(
    () =>
      (revenueQuery.data?.revenueTrend ?? []).map((item) => ({
        period: formatPeriodLabel(item.period),
        revenue: item.revenue,
      })),
    [revenueQuery.data],
  );

  const plantHealthData = useMemo(
    () =>
      Object.entries(plantQuery.data?.statusDistribution ?? {}).map(
        ([name, value], index) => ({
          name: humanizeLabel(name),
          value,
          color: PIE_COLORS[index % PIE_COLORS.length],
          dotClass: DOT_CLASSES[index % DOT_CLASSES.length],
        }),
      ),
    [plantQuery.data],
  );

  const maintenanceStatusData = useMemo(
    () =>
      Object.entries(maintenanceQuery.data?.visitsByStatus ?? {}).map(
        ([status, count]) => ({
          status: humanizeLabel(status),
          count,
        }),
      ),
    [maintenanceQuery.data],
  );

  const planRevenueData = useMemo(
    () =>
      (revenueQuery.data?.revenueByPlan ?? [])
        .slice(0, 6)
        .map((item) => ({
          plan: item.plan,
          revenue: item.revenue,
        })),
    [revenueQuery.data],
  );

  const loadingInitial =
    !overviewQuery.data &&
    !revenueQuery.data &&
    !plantQuery.data &&
    !maintenanceQuery.data &&
    !esgQuery.data;

  const hasAnyError =
    overviewQuery.isError ||
    revenueQuery.isError ||
    plantQuery.isError ||
    maintenanceQuery.isError ||
    esgQuery.isError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Live insights from your operations, plant health, and sustainability performance."
        breadcrumbs={[
          { label: 'Partner', href: '/partner' },
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

      {hasAnyError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Some analytics endpoints failed to load. Available charts still show live backend data.
        </div>
      )}

      {loadingInitial && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live analytics...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
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
                {stat.change && (
                  <span className="rounded-full bg-gray-900/5 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <ChartCard title="Revenue Trend" subtitle="Last 12 months of successful payment revenue">
        <div className="h-80">
          {revenueTrendData.length === 0 ? (
            <ChartEmpty text="Revenue trend is not available yet." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(value: number) => formatCompact(value)}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
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
                  dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Plant Health Distribution" subtitle="Live count by current plant status">
          <div className="h-64">
            {plantHealthData.length === 0 ? (
              <ChartEmpty text="Plant health distribution is not available yet." />
            ) : (
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
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {plantHealthData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className={cn('h-2.5 w-2.5 rounded-full', entry.dotClass)} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Maintenance Status" subtitle="Current visit status distribution">
          <div className="h-64">
            {maintenanceStatusData.length === 0 ? (
              <ChartEmpty text="Maintenance status data is not available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                  <XAxis
                    dataKey="status"
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
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Revenue by Plan" subtitle="Live invoiced revenue grouped by subscription plan">
        <div className="h-64">
          {planRevenueData.length === 0 ? (
            <ChartEmpty text="Plan-wise revenue is not available yet." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis
                  dataKey="plan"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(value: number) => formatCompact(value)}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
