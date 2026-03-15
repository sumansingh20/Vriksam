'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type VisitStatus = 'completed' | 'scheduled' | 'in_progress' | 'cancelled';

interface MaintenanceVisit {
  id: string;
  date: string;
  status: VisitStatus;
  technician: string;
  notes: string;
  location: string;
  plantsServiced: number;
  hasImages: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const maintenanceHistory: MaintenanceVisit[] = [
  { id: 'MV-001', date: '2026-03-25', status: 'scheduled', technician: 'Sneha Reddy', notes: 'Quarterly deep care for Pune Office plants', location: 'Pune Office', plantsServiced: 12, hasImages: false },
  { id: 'MV-002', date: '2026-03-20', status: 'scheduled', technician: 'Raj Patel', notes: 'Monthly maintenance - Floor 3 & Lobby', location: 'Mumbai HQ', plantsServiced: 20, hasImages: false },
  { id: 'MV-003', date: '2026-03-14', status: 'completed', technician: 'Raj Patel', notes: 'Replaced damaged Peace Lily, treated Spider Mites on Boston Fern. Applied neem oil treatment.', location: 'Mumbai HQ', plantsServiced: 15, hasImages: true },
  { id: 'MV-004', date: '2026-03-07', status: 'completed', technician: 'Raj Patel', notes: 'Routine watering, pruning, and fertilization. All plants in good health except Boston Fern (needs attention).', location: 'Mumbai HQ', plantsServiced: 18, hasImages: true },
  { id: 'MV-005', date: '2026-02-28', status: 'completed', technician: 'Sneha Reddy', notes: 'Installed 3 new Areca Palms. Soil testing completed. Recommended increased watering schedule.', location: 'Pune Office', plantsServiced: 12, hasImages: true },
  { id: 'MV-006', date: '2026-02-21', status: 'completed', technician: 'Raj Patel', notes: 'Quarterly deep clean and pest prevention spray. All plants healthy.', location: 'Mumbai HQ', plantsServiced: 22, hasImages: true },
  { id: 'MV-007', date: '2026-02-14', status: 'cancelled', technician: 'Raj Patel', notes: 'Cancelled due to office closure (holiday). Rescheduled to Feb 21.', location: 'Mumbai HQ', plantsServiced: 0, hasImages: false },
  { id: 'MV-008', date: '2026-02-07', status: 'completed', technician: 'Raj Patel', notes: 'Regular maintenance. Repotted 3 Snake Plants that outgrew their containers.', location: 'Mumbai HQ', plantsServiced: 16, hasImages: true },
];

/* -------------------------------------------------------------------------- */
/*  Status config                                                             */
/* -------------------------------------------------------------------------- */

const STATUS_CONFIG: Record<VisitStatus, { label: string; icon: React.ElementType; color: string; bg: string; line: string }> = {
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', line: 'bg-emerald-500' },
  scheduled: { label: 'Scheduled', icon: Clock, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10', line: 'bg-sky-500' },
  in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', line: 'bg-amber-500' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-500/10', line: 'bg-gray-400' },
};

/* -------------------------------------------------------------------------- */
/*  Timeline Item                                                             */
/* -------------------------------------------------------------------------- */

function TimelineItem({ visit, index, isLast }: { visit: MaintenanceVisit; index: number; isLast: boolean }) {
  const config = STATUS_CONFIG[visit.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative flex gap-4 pb-8"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 h-[calc(100%-24px)] w-0.5 bg-gray-200 dark:bg-white/10" />
      )}

      {/* Status icon */}
      <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', config.bg)}>
        <StatusIcon className={cn('h-5 w-5', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 rounded-2xl border border-gray-200/60 bg-white/80 p-4 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', config.bg, config.color)}>
                {config.label}
              </span>
              <span className="text-xs text-gray-400">
                {visit.id}
              </span>
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">
              {visit.location}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(visit.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Notes */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {visit.notes}
        </p>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {visit.technician}
          </div>
          {visit.plantsServiced > 0 && (
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {visit.plantsServiced} plants serviced
            </div>
          )}
          {visit.hasImages && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ImageIcon className="h-3 w-3" />
              Photos available
            </div>
          )}
        </div>

        {/* Image placeholders */}
        {visit.hasImages && (
          <div className="mt-3 flex gap-2">
            <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-white/5" />
            <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-white/5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ClientMaintenancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance History"
        description="View past and upcoming maintenance visits for your locations."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'Maintenance' },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Visits', value: '32', color: 'text-gray-900' },
          { label: 'Completed', value: '28', color: 'text-emerald-600' },
          { label: 'Upcoming', value: '2', color: 'text-sky-600' },
          { label: 'Cancelled', value: '2', color: 'text-gray-400' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200/60 bg-white/80 p-4 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={cn('mt-1 text-xl font-bold dark:text-white', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-3xl">
        {maintenanceHistory.map((visit, index) => (
          <TimelineItem
            key={visit.id}
            visit={visit}
            index={index}
            isLast={index === maintenanceHistory.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
