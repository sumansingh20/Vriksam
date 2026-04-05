'use client';

import { useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  TrendingUp,
  Award,
  TreePine,
  Leaf,
  AlertTriangle,
} from 'lucide-react';
import { ESGMetrics, type ESGMetric } from '@/components/dashboard/esg-metrics';
import { PageHeader } from '@/components/layout/page-header';
import { useESGMetrics, usePlantMetrics } from '@/hooks/use-analytics';

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
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

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-center dark:border-white/10">
      <p className="px-4 text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

export default function ClientESGPage() {
  const esgQuery = useESGMetrics();
  const plantQuery = usePlantMetrics();

  const metrics = useMemo<ESGMetric[]>(() => {
    if (!esgQuery.data) return [];

    const co2Target = Math.max(Math.ceil(esgQuery.data.totalCO2Absorbed * 1.25), 1);
    const o2Target = Math.max(Math.ceil(esgQuery.data.totalO2Produced * 1.25), 1);

    const highPurifyingShare =
      esgQuery.data.totalActivePlants > 0
        ? (esgQuery.data.speciesWithHighAirPurifying / esgQuery.data.totalActivePlants) * 100
        : 0;

    return [
      {
        id: 'co2',
        title: 'CO2 Absorbed',
        value: Math.round(esgQuery.data.totalCO2Absorbed),
        unit: 'g/day',
        target: co2Target,
        icon: 'co2',
        gradient: 'from-emerald-500 to-green-600',
      },
      {
        id: 'o2',
        title: 'O2 Produced',
        value: Math.round(esgQuery.data.totalO2Produced),
        unit: 'g/day',
        target: o2Target,
        icon: 'o2',
        gradient: 'from-sky-500 to-cyan-600',
      },
      {
        id: 'green_score',
        title: 'Green Score',
        value: esgQuery.data.greenScore,
        unit: '/100',
        target: 100,
        icon: 'green_score',
        gradient: 'from-amber-500 to-orange-500',
      },
      {
        id: 'wellness',
        title: 'High Purifying Share',
        value: Math.round(highPurifyingShare),
        unit: '%',
        target: 100,
        icon: 'wellness',
        gradient: 'from-rose-500 to-pink-600',
      },
    ];
  }, [esgQuery.data]);

  const healthTrend = useMemo(
    () =>
      (plantQuery.data?.recentHealthTrend ?? []).map((entry) => ({
        date: new Date(entry.date).toLocaleDateString('en-IN', {
          month: 'short',
          day: '2-digit',
        }),
        avgScore: entry.avgScore,
      })),
    [plantQuery.data],
  );

  const speciesData = useMemo(
    () =>
      (plantQuery.data?.speciesDistribution ?? []).slice(0, 6).map((entry) => ({
        species: entry.species,
        count: entry.count,
      })),
    [plantQuery.data],
  );

  const highPurifyingShare =
    esgQuery.data && esgQuery.data.totalActivePlants > 0
      ? (esgQuery.data.speciesWithHighAirPurifying / esgQuery.data.totalActivePlants) * 100
      : 0;

  const hasError = esgQuery.isError || plantQuery.isError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ESG Impact Dashboard"
        description="Live environmental and wellness impact from your active green infrastructure."
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

      {hasError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Some ESG analytics could not be loaded right now. Available data is displayed below.
        </div>
      )}

      <ESGMetrics metrics={metrics} isLoading={esgQuery.isLoading && !esgQuery.data} />

      {esgQuery.data?.environmentalImpactSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-5 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-500/10"
        >
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            Environmental Impact Summary
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
            {esgQuery.data.environmentalImpactSummary}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Plant Health Trend"
          subtitle="Average health score from recent maintenance logs"
        >
          <div className="h-72">
            {healthTrend.length === 0 ? (
              <EmptyChart message="Health trend data is not available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    domain={[0, 10]}
                    tickFormatter={(value: number) => value.toFixed(1)}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(1), 'Avg Health Score']}
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981', stroke: '#fff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Top Species Footprint"
          subtitle="Most represented species in your active plant network"
        >
          <div className="h-72">
            {speciesData.length === 0 ? (
              <EmptyChart message="Species distribution is not available yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={speciesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb30" />
                  <XAxis
                    dataKey="species"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [value, 'Plants']}
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              {esgQuery.data ? `${esgQuery.data.carbonOffsetEquivalent}` : '--'}
            </p>
            <p className="text-xs text-gray-500">Tree-equivalent yearly impact</p>
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
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {esgQuery.data ? `${highPurifyingShare.toFixed(1)}%` : '--'}
            </p>
            <p className="text-xs text-gray-500">High air-purifying plant share</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
            <TreePine className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {esgQuery.data ? formatCompact(esgQuery.data.totalActivePlants) : '--'}
            </p>
            <p className="text-xs text-gray-500">Active plants monitored</p>
          </div>
        </motion.div>
      </div>

      {plantQuery.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Real-Time Plant Snapshot
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Current status from your live plant monitoring system
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <Leaf className="h-3.5 w-3.5" />
              Survival rate {plantQuery.data.survivalRate.toFixed(1)}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Avg Health Score</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {plantQuery.data.averageHealthScore.toFixed(1)} / 10
              </p>
            </div>
            <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Species Tracked</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {plantQuery.data.speciesDistribution.length}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Locations Covered</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                {plantQuery.data.plantsByLocation.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {!esgQuery.data && !esgQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-300/80 bg-white/70 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          ESG metrics are currently unavailable for this account.
        </div>
      )}
    </div>
  );
}
