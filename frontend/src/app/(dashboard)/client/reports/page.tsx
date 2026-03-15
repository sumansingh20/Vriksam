'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Leaf,
  BarChart3,
  Wrench,
  CalendarDays,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ReportStatus = 'ready' | 'generating' | 'idle';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  lastGenerated: string;
}

interface RecentReport {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  size: string;
  status: 'ready' | 'generating';
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const reportCards: ReportCard[] = [
  {
    id: 'plant-health',
    title: 'Plant Health Report',
    description: 'Comprehensive analysis of all plant health metrics including growth rates, disease detection, and care recommendations.',
    icon: Leaf,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10',
    lastGenerated: '12 Mar 2026',
  },
  {
    id: 'esg-impact',
    title: 'ESG Impact Report',
    description: 'Environmental impact metrics including CO2 absorption, oxygen production, air quality improvement, and green score.',
    icon: BarChart3,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-500/10',
    lastGenerated: '10 Mar 2026',
  },
  {
    id: 'service-report',
    title: 'Service Report',
    description: 'Detailed log of all maintenance visits, technician activities, plant replacements, and service quality ratings.',
    icon: Wrench,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10',
    lastGenerated: '08 Mar 2026',
  },
  {
    id: 'monthly-summary',
    title: 'Monthly Summary',
    description: 'Complete monthly overview combining health metrics, service activities, billing summary, and key highlights.',
    icon: CalendarDays,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-500/10',
    lastGenerated: '01 Mar 2026',
  },
];

const recentReports: RecentReport[] = [
  { id: 'RPT-001', name: 'Plant Health Report - March 2026', type: 'Plant Health', generatedDate: '2026-03-12', size: '2.4 MB', status: 'ready' },
  { id: 'RPT-002', name: 'ESG Impact Report - Q1 2026', type: 'ESG Impact', generatedDate: '2026-03-10', size: '3.8 MB', status: 'ready' },
  { id: 'RPT-003', name: 'Service Report - February 2026', type: 'Service', generatedDate: '2026-03-08', size: '1.6 MB', status: 'ready' },
  { id: 'RPT-004', name: 'Monthly Summary - February 2026', type: 'Monthly Summary', generatedDate: '2026-03-01', size: '4.2 MB', status: 'ready' },
  { id: 'RPT-005', name: 'Plant Health Report - February 2026', type: 'Plant Health', generatedDate: '2026-02-12', size: '2.1 MB', status: 'ready' },
  { id: 'RPT-006', name: 'ESG Impact Report - February 2026', type: 'ESG Impact', generatedDate: '2026-02-10', size: '3.5 MB', status: 'ready' },
];

/* -------------------------------------------------------------------------- */
/*  Report Card Component                                                      */
/* -------------------------------------------------------------------------- */

function ReportCardItem({ report, index }: { report: ReportCard; index: number }) {
  const [status, setStatus] = useState<ReportStatus>('idle');
  const Icon = report.icon;

  const handleGenerate = () => {
    setStatus('generating');
    setTimeout(() => setStatus('ready'), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl transition-all duration-200 hover:shadow-md dark:border-white/5 dark:bg-gray-900/50"
    >
      <div className={cn('mb-4 inline-flex rounded-xl p-3', report.iconBg)}>
        <Icon className={cn('h-6 w-6', report.iconColor)} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {report.description}
      </p>
      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
        <Clock className="h-3 w-3" />
        Last generated: {report.lastGenerated}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={status === 'generating'}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-emerald-500/25 disabled:opacity-70"
        >
          {status === 'generating' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : status === 'ready' ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Ready
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Generate
            </>
          )}
        </button>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ClientReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download reports for your green infrastructure."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'Reports' },
        ]}
      />

      {/* Report Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {reportCards.map((report, i) => (
          <ReportCardItem key={report.id} report={report} index={i} />
        ))}
      </div>

      {/* Recent Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Size
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {recentReports.map((report, i) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-400">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">
                    {new Date(report.generatedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">{report.size}</td>
                  <td className="px-6 py-3.5 text-center">
                    <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
