'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

type VisitStatus = 'completed' | 'scheduled' | 'in_progress' | 'cancelled' | 'overdue';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface VisitApi {
  id: string;
  status: string;
  scheduledDate: string;
  notes?: string | null;
  technician?: {
    user?: {
      name?: string;
      fullName?: string;
    };
  };
  plant?: {
    location?: {
      name?: string;
      client?: {
        companyName?: string;
      };
    };
  };
}

interface MaintenanceVisit {
  id: string;
  date: string;
  status: VisitStatus;
  technician: string;
  notes: string;
  location: string;
  plantsServiced: number;
}

const STATUS_CONFIG: Record<
  VisitStatus,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  scheduled: {
    label: 'Scheduled',
    icon: Clock,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10',
  },
  in_progress: {
    label: 'In Progress',
    icon: AlertCircle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
  },
  cancelled: {
    label: 'Cancelled',
    icon: AlertCircle,
    color: 'text-gray-500 dark:text-gray-400',
    bg: 'bg-gray-500/10',
  },
  overdue: {
    label: 'Overdue',
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10',
  },
};

function normalizeStatus(value: string): VisitStatus {
  const status = value.toLowerCase();
  if (status.includes('complete')) return 'completed';
  if (status.includes('progress')) return 'in_progress';
  if (status.includes('cancel')) return 'cancelled';
  if (status.includes('miss') || status.includes('overdue')) return 'overdue';
  return 'scheduled';
}

function TimelineItem({
  visit,
  index,
  isLast,
}: {
  visit: MaintenanceVisit;
  index: number;
  isLast: boolean;
}) {
  const config = STATUS_CONFIG[visit.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative flex gap-4 pb-8"
    >
      {!isLast && (
        <div className="absolute left-[19px] top-10 h-[calc(100%-24px)] w-0.5 bg-gray-200 dark:bg-white/10" />
      )}

      <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', config.bg)}>
        <StatusIcon className={cn('h-5 w-5', config.color)} />
      </div>

      <div className="flex-1 rounded-2xl border border-gray-200/60 bg-white/80 p-4 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold', config.bg, config.color)}>
                {config.label}
              </span>
              <span className="text-xs text-gray-400">{visit.id}</span>
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">{visit.location}</h3>
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

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{visit.notes}</p>

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
        </div>
      </div>
    </motion.div>
  );
}

export default function ClientMaintenancePage() {
  const visitsQuery = useQuery({
    queryKey: ['client', 'maintenance', 'history'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<VisitApi[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 120,
            sortBy: 'scheduledDate',
            sortOrder: 'desc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const maintenanceHistory = useMemo<MaintenanceVisit[]>(
    () =>
      (visitsQuery.data ?? []).map((visit) => ({
        id: visit.id,
        date: visit.scheduledDate,
        status: normalizeStatus(visit.status),
        technician:
          visit.technician?.user?.name ||
          visit.technician?.user?.fullName ||
          'Assigned Technician',
        notes: visit.notes || 'Visit details will be available after technician updates.',
        location: visit.plant?.location?.name || visit.plant?.location?.client?.companyName || 'Client Location',
        plantsServiced: 1,
      })),
    [visitsQuery.data],
  );

  const stats = useMemo(
    () => ({
      total: maintenanceHistory.length,
      completed: maintenanceHistory.filter((visit) => visit.status === 'completed').length,
      upcoming: maintenanceHistory.filter((visit) => visit.status === 'scheduled').length,
      cancelled: maintenanceHistory.filter((visit) => visit.status === 'cancelled').length,
    }),
    [maintenanceHistory],
  );

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

      {visitsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading maintenance history...
        </div>
      )}

      {visitsQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load maintenance history right now.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Visits', value: stats.total, color: 'text-gray-900' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-600' },
          { label: 'Upcoming', value: stats.upcoming, color: 'text-sky-600' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-gray-400' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200/60 bg-white/80 p-4 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={cn('mt-1 text-xl font-bold dark:text-white', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl">
        {maintenanceHistory.map((visit, index) => (
          <TimelineItem key={visit.id} visit={visit} index={index} isLast={index === maintenanceHistory.length - 1} />
        ))}
      </div>

      {maintenanceHistory.length === 0 && !visitsQuery.isLoading && (
        <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
          No maintenance history available yet.
        </div>
      )}
    </div>
  );
}
