'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Leaf,
  BarChart3,
  Wrench,
  CalendarDays,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import {
  useESGMetrics,
  useMaintenanceMetrics,
  useOverviewStats,
  usePlantMetrics,
  useRevenueData,
} from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  size: string;
}

interface ReportCard {
  id: 'plant-health' | 'esg-impact' | 'service-report' | 'monthly-summary';
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const REPORT_CARDS: ReportCard[] = [
  {
    id: 'plant-health',
    title: 'Plant Health Report',
    description:
      'Comprehensive analysis of plant health metrics, status distribution, and trends.',
    icon: Leaf,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10',
  },
  {
    id: 'esg-impact',
    title: 'ESG Impact Report',
    description:
      'Environmental impact metrics including CO2 absorption, oxygen production, and green score.',
    icon: BarChart3,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-500/10',
  },
  {
    id: 'service-report',
    title: 'Service Report',
    description:
      'Operational summary of maintenance outcomes, completion quality, and service rates.',
    icon: Wrench,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10',
  },
  {
    id: 'monthly-summary',
    title: 'Monthly Summary',
    description:
      'A combined snapshot of health, service, ESG, and revenue metrics for this period.',
    icon: CalendarDays,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-500/10',
  },
];

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadJson(filename: string, payload: unknown): string {
  const content = JSON.stringify(payload, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
  return formatBytes(blob.size);
}

export default function ClientReportsPage() {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  const overviewQuery = useOverviewStats();
  const plantQuery = usePlantMetrics();
  const maintenanceQuery = useMaintenanceMetrics();
  const revenueQuery = useRevenueData({ period: 'monthly' });
  const esgQuery = useESGMetrics();

  const isLoading =
    overviewQuery.isLoading ||
    plantQuery.isLoading ||
    maintenanceQuery.isLoading ||
    revenueQuery.isLoading ||
    esgQuery.isLoading;

  const hasError =
    overviewQuery.isError ||
    plantQuery.isError ||
    maintenanceQuery.isError ||
    revenueQuery.isError ||
    esgQuery.isError;

  const reportData = useMemo(
    () => ({
      'plant-health': {
        generatedAt: new Date().toISOString(),
        overview: overviewQuery.data,
        plantMetrics: plantQuery.data,
      },
      'esg-impact': {
        generatedAt: new Date().toISOString(),
        overview: overviewQuery.data,
        esgMetrics: esgQuery.data,
      },
      'service-report': {
        generatedAt: new Date().toISOString(),
        overview: overviewQuery.data,
        maintenanceMetrics: maintenanceQuery.data,
      },
      'monthly-summary': {
        generatedAt: new Date().toISOString(),
        overview: overviewQuery.data,
        plantMetrics: plantQuery.data,
        maintenanceMetrics: maintenanceQuery.data,
        revenueMetrics: revenueQuery.data,
        esgMetrics: esgQuery.data,
      },
    }),
    [esgQuery.data, maintenanceQuery.data, overviewQuery.data, plantQuery.data, revenueQuery.data],
  );

  const lastRefreshDate = useMemo(() => {
    const timestamps = [
      overviewQuery.dataUpdatedAt,
      plantQuery.dataUpdatedAt,
      maintenanceQuery.dataUpdatedAt,
      revenueQuery.dataUpdatedAt,
      esgQuery.dataUpdatedAt,
    ].filter((value) => value > 0);

    if (timestamps.length === 0) return null;
    return new Date(Math.max(...timestamps));
  }, [
    esgQuery.dataUpdatedAt,
    maintenanceQuery.dataUpdatedAt,
    overviewQuery.dataUpdatedAt,
    plantQuery.dataUpdatedAt,
    revenueQuery.dataUpdatedAt,
  ]);

  function handleGenerate(reportId: ReportCard['id'], title: string) {
    if (hasError || isLoading) return;

    setGeneratingId(reportId);

    const fileName = `${reportId}-${new Date().toISOString().split('T')[0] || 'report'}.json`;
    const size = downloadJson(fileName, reportData[reportId]);

    setGeneratedReports((previous) => [
      {
        id: `${reportId}-${Date.now()}`,
        name: title,
        type: reportId,
        generatedDate: new Date().toISOString(),
        size,
      },
      ...previous,
    ]);

    setGeneratingId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download live reports from your operational data."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'Reports' },
        ]}
      />

      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live metrics for report generation...
        </div>
      )}

      {hasError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Some analytics data is unavailable right now. Retry once data refresh completes.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {REPORT_CARDS.map((report, index) => {
          const Icon = report.icon;
          const isGenerating = generatingId === report.id;

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl transition-all duration-200 hover:shadow-md dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className={cn('mb-4 inline-flex rounded-xl p-3', report.iconBg)}>
                <Icon className={cn('h-6 w-6', report.iconColor)} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{report.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                <RefreshCw className="h-3 w-3" />
                Last refreshed:{' '}
                {lastRefreshDate
                  ? lastRefreshDate.toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Waiting for first live response'}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleGenerate(report.id, report.title)}
                  disabled={isGenerating || isLoading || hasError}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Generate JSON
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  <FileText className="h-4 w-4" />
                  Print / PDF
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Report</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Size</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {generatedReports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.04 }}
                  className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">{report.type}</td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">
                    {new Date(report.generatedDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">{report.size}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" />
                      Ready
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {generatedReports.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No reports generated in this session yet.
          </div>
        )}
      </motion.div>
    </div>
  );
}
