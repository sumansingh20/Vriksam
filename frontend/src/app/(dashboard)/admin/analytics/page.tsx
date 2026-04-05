'use client';

import { useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import {
  TrendingUp,
  Users,
  Sprout,
  Star,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  useMaintenanceMetrics,
  useOverviewStats,
  usePlantMetrics,
  useRevenueData,
} from '@/hooks/use-analytics';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];
const DOT_CLASSES = ['bg-emerald-500', 'bg-amber-500', 'bg-red-500', 'bg-violet-500', 'bg-sky-500'];

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
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

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-center dark:border-white/10">
      <p className="px-4 text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const overviewQuery = useOverviewStats();
  const revenueQuery = useRevenueData({ period: 'monthly' });
  const plantQuery = usePlantMetrics();
  const maintenanceQuery = useMaintenanceMetrics();

  const revenueTrend = useMemo(() => {
    const source = revenueQuery.data?.revenueTrend ?? [];
    return source.map((entry, index) => {
      const start = Math.max(0, index - 2);
      const window = source.slice(start, index + 1);
      const rollingAverage =
        window.reduce((sum, item) => sum + item.revenue, 0) / Math.max(window.length, 1);

      return {
        month: formatPeriodLabel(entry.period),
        revenue: entry.revenue,
        avg3m: Math.round(rollingAverage),
      };
    });
  }, [revenueQuery.data]);

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

  const maintenanceStatusData = useMemo(() => {
    const statusEntries = Object.entries(maintenanceQuery.data?.visitsByStatus ?? {});
    const total = statusEntries.reduce((sum, [, count]) => sum + count, 0);

    return statusEntries.map(([status, count]) => ({
      status: humanizeLabel(status),
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
      count,
    }));
  }, [maintenanceQuery.data]);

  const locationCoverageData = useMemo(
    () =>
      (plantQuery.data?.plantsByLocation ?? []).slice(0, 8).map((item) => ({
        location: item.location,
        plants: item.count,
      })),
    [plantQuery.data],
  );

  const topTechnicians = useMemo(
    () => (maintenanceQuery.data?.topTechnicians ?? []).slice(0, 5),
    [maintenanceQuery.data],
  );

  const hasError =
    overviewQuery.isError ||
    revenueQuery.isError ||
    plantQuery.isError ||
    maintenanceQuery.isError;

  const loadingInitial =
    !overviewQuery.data &&
    !revenueQuery.data &&
    !plantQuery.data &&
    !maintenanceQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Comprehensive live insights into your green infrastructure performance."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Analytics' },
        ]}
      />

      {hasError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Some analytics sources failed to load. Available charts below are live.
        </div>
      )}

      {loadingInitial && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading analytics...
        </div>
      )}

      <ChartCard title="Revenue Trend" subtitle="Monthly revenue with rolling 3-month average">
        <div className="h-80">
          {revenueTrend.length === 0 ? (
            <EmptyChart message="Revenue trend is not available yet." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value: number) => formatCompact(value)} />
                <Tooltip
                  formatter={(value: number, key: string) => [formatCurrency(value), key === 'revenue' ? 'Revenue' : '3M Avg']}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revenueArea)" name="Revenue" />
                <Line type="monotone" dataKey="avg3m" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="4 4" name="3M Avg" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Plant Health Distribution" subtitle="Current status breakdown from live plant records">
          <div className="h-64">
            {plantHealthData.length === 0 ? (
              <EmptyChart message="Plant health distribution is not available yet." />
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {plantHealthData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${entry.dotClass}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Maintenance Status Mix" subtitle="Share of visits by status">
          <div className="h-64">
            {maintenanceStatusData.length === 0 ? (
              <EmptyChart message="Maintenance status is not available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                  <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(value: number) => `${value}%`} />
                  <Tooltip
                    formatter={(value: number, _key: string, payload: { payload?: { count?: number } }) => [
                      `${value}% (${payload?.payload?.count ?? 0} visits)`,
                      'Status Share',
                    ]}
                  />
                  <Bar dataKey="percentage" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Location Coverage" subtitle="Top locations by active plant count">
          <div className="h-64">
            {locationCoverageData.length === 0 ? (
              <EmptyChart message="Location coverage data is not available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationCoverageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                  <XAxis dataKey="location" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip formatter={(value: number) => [value, 'Plants']} />
                  <Bar dataKey="plants" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Top Performing Technicians" subtitle="Based on visits and service ratings">
          <div className="space-y-3">
            {topTechnicians.length === 0 ? (
              <EmptyChart message="Technician performance data is not available yet." />
            ) : (
              topTechnicians.map((tech, index) => (
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{tech.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {tech.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        {tech.visits} visits
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ChartCard>
      </div>

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
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {revenueQuery.data ? `${revenueQuery.data.revenueGrowth > 0 ? '+' : ''}${revenueQuery.data.revenueGrowth.toFixed(1)}%` : '--'}
            </p>
            <p className="text-xs text-gray-500">Revenue growth this period</p>
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {revenueQuery.data ? `${revenueQuery.data.collectionRate.toFixed(1)}%` : '--'}
            </p>
            <p className="text-xs text-gray-500">Invoice collection rate</p>
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {plantQuery.data ? `${plantQuery.data.survivalRate.toFixed(1)}%` : '--'}
            </p>
            <p className="text-xs text-gray-500">Plant survival rate</p>
          </div>
        </motion.div>
      </div>

      {overviewQuery.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Operational Snapshot</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Active Clients</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{overviewQuery.data.activeClients}</p>
            </div>
            <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Plants</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{overviewQuery.data.totalPlants}</p>
            </div>
            <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Technicians</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{overviewQuery.data.totalTechnicians}</p>
            </div>
            <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Monthly Revenue</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(overviewQuery.data.monthlyRevenue)}</p>
            </div>
          </div>
        </motion.div>
      )}

      {hasError && !overviewQuery.data && !revenueQuery.data && !plantQuery.data && !maintenanceQuery.data && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-300/80 bg-white/70 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Analytics are currently unavailable for this account.
        </div>
      )}
    </div>
  );
}
