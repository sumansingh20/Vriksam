'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  Clock,
  FileBarChart,
  Leaf,
  Loader2,
  MapPin,
  Search as SearchIcon,
  UserCog,
  UserPlus,
  Users,
  Wrench,
} from 'lucide-react';
import {
  RevealBlock,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/section-transition';
import { PageHeader } from '@/components/layout/page-header';
import {
  useMaintenanceMetrics,
  useOverviewStats,
  useRevenueData,
  useTeamPerformance,
} from '@/hooks/use-analytics';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface ServiceVisitLite {
  id: string;
  scheduledDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  technician?: {
    user?: {
      name?: string;
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

const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  SCHEDULED: {
    label: 'Scheduled',
    classes: 'bg-blue-100 text-blue-700',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    classes: 'bg-amber-100 text-amber-700',
  },
  COMPLETED: {
    label: 'Completed',
    classes: 'bg-emerald-100 text-emerald-700',
  },
  MISSED: {
    label: 'Overdue',
    classes: 'bg-red-100 text-red-700',
  },
  CANCELLED: {
    label: 'Cancelled',
    classes: 'bg-slate-100 text-slate-700',
  },
};

const DEFAULT_STATUS_STYLE = {
  label: 'Scheduled',
  classes: 'bg-blue-100 text-blue-700',
};

function formatCurrency(value: number) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
}

function formatTimeLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimeAgo(value?: string) {
  if (!value) return 'just now';
  const ms = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(ms / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_STYLES[status] || DEFAULT_STATUS_STYLE;

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        config.classes,
      )}
    >
      {config.label}
    </span>
  );
}

function ActivityIcon({ status }: { status: string }) {
  if (status === 'MISSED') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-600" />
      </div>
    );
  }

  if (status === 'COMPLETED') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
        <CalendarCheck className="h-4 w-4 text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
      <Wrench className="h-4 w-4 text-sky-600" />
    </div>
  );
}

export default function PartnerDashboardPage() {
  const overviewQuery = useOverviewStats();
  const revenueQuery = useRevenueData({ period: 'monthly' });
  const maintenanceQuery = useMaintenanceMetrics();
  const teamsQuery = useTeamPerformance();

  const scheduleQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'schedule'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<ServiceVisitLite[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 80,
            sortBy: 'scheduledDate',
            sortOrder: 'asc',
          },
        },
      );
      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const recentVisitsQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'recent-activity'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<ServiceVisitLite[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 12,
            sortBy: 'updatedAt',
            sortOrder: 'desc',
          },
        },
      );
      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const teamMemberCount = useMemo(
    () =>
      (teamsQuery.data?.teams ?? []).reduce(
        (total, team) => total + team.memberCount,
        0,
      ),
    [teamsQuery.data],
  );

  const stats = useMemo(
    () => [
      {
        title: 'Active Clients',
        value: overviewQuery.data?.activeClients ?? 0,
        change: revenueQuery.data?.revenueGrowth ?? 0,
        changeLabel: 'Revenue trend',
        icon: Users,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-500/10',
      },
      {
        title: 'Plants Managed',
        value: (overviewQuery.data?.totalPlants ?? 0).toLocaleString('en-IN'),
        change: maintenanceQuery.data?.averageRating ?? 0,
        changeLabel: 'Service rating',
        icon: Leaf,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-500/10',
      },
      {
        title: 'Pending Visits',
        value: overviewQuery.data?.pendingVisits ?? 0,
        change: maintenanceQuery.data?.completionRate ?? 0,
        changeLabel: 'Completion rate',
        icon: CalendarCheck,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-500/10',
      },
      {
        title: 'Team Members',
        value: teamMemberCount,
        change: teamsQuery.data?.teams.length ?? 0,
        changeLabel: 'Active teams',
        icon: UserCog,
        iconColor: 'text-sky-600',
        iconBg: 'bg-sky-500/10',
      },
    ],
    [
      maintenanceQuery.data?.averageRating,
      maintenanceQuery.data?.completionRate,
      overviewQuery.data?.activeClients,
      overviewQuery.data?.pendingVisits,
      overviewQuery.data?.totalPlants,
      revenueQuery.data?.revenueGrowth,
      teamMemberCount,
      teamsQuery.data?.teams.length,
    ],
  );

  const visits = useMemo(() => scheduleQuery.data ?? [], [scheduleQuery.data]);

  const todayVisits = useMemo(() => {
    const today = new Date();
    return visits.filter(
      (visit) =>
        new Date(visit.scheduledDate).toDateString() === today.toDateString(),
    );
  }, [visits]);

  const upcomingVisits = useMemo(
    () =>
      visits
        .filter((visit) => new Date(visit.scheduledDate).getTime() >= Date.now())
        .slice(0, 6),
    [visits],
  );

  const visibleSchedule =
    todayVisits.length > 0 ? todayVisits.slice(0, 6) : upcomingVisits;

  const recentActivity = useMemo(
    () =>
      (recentVisitsQuery.data ?? []).slice(0, 8).map((visit) => {
        const clientName =
          visit.plant?.location?.client?.companyName ?? 'Client account';
        const locationName = visit.plant?.location?.name ?? 'Site location';
        const statusLabel =
          STATUS_STYLES[visit.status]?.label ?? 'Visit updated';

        return {
          id: visit.id,
          status: visit.status,
          description: `${statusLabel}: ${clientName}`,
          detail: `${locationName}${visit.technician?.user?.name ? ` | ${visit.technician.user.name}` : ''}`,
          timeAgo: formatTimeAgo(visit.updatedAt || visit.createdAt),
        };
      }),
    [recentVisitsQuery.data],
  );

  const quickActions = [
    {
      title: 'Schedule Visit',
      description: 'Create and assign a new service visit',
      icon: CalendarCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      href: '/partner/maintenance',
    },
    {
      title: 'Add Client',
      description: 'Onboard a new organization account',
      icon: UserPlus,
      color: 'text-green-600',
      bg: 'bg-green-500/10',
      href: '/partner/clients',
    },
    {
      title: 'Plant Inspection',
      description: 'Review plant health and site quality',
      icon: SearchIcon,
      color: 'text-teal-600',
      bg: 'bg-teal-500/10',
      href: '/partner/plants',
    },
    {
      title: 'Generate Report',
      description: 'Export your latest operational insights',
      icon: FileBarChart,
      color: 'text-sky-600',
      bg: 'bg-sky-500/10',
      href: '/partner/reports',
    },
  ];

  const loading =
    overviewQuery.isLoading ||
    maintenanceQuery.isLoading ||
    revenueQuery.isLoading ||
    teamsQuery.isLoading;

  const hasError =
    overviewQuery.isError ||
    maintenanceQuery.isError ||
    revenueQuery.isError ||
    teamsQuery.isError ||
    scheduleQuery.isError ||
    recentVisitsQuery.isError;

  return (
    <div className="space-y-6">
      <SectionTransition className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-[#f4faf5] via-[#f8fcf9] to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-12 h-48 w-48 rounded-full bg-emerald-300/20 blur-[90px]" />
          <div className="absolute right-[-3rem] top-6 h-40 w-40 rounded-full bg-cyan-300/18 blur-[80px]" />
        </div>

        <div className="relative">
          <PageHeader
            title="Partner Operations"
            description="Coordinate teams, service schedules, and client outcomes from one live operational view."
            showAccent={false}
            className="mb-0"
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Today&apos;s Visits</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{todayVisits.length}</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Monthly Revenue</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {formatCurrency(overviewQuery.data?.monthlyRevenue ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Completion Rate</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {maintenanceQuery.data ? `${maintenanceQuery.data.completionRate.toFixed(1)}%` : '--'}
              </p>
            </div>
          </div>
        </div>
      </SectionTransition>

      {hasError && (
        <RevealBlock>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Some feeds are temporarily unavailable. Widgets below use live data that loaded successfully.
          </div>
        </RevealBlock>
      )}

      {loading && (
        <RevealBlock>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing live partner dashboard data...
          </div>
        </RevealBlock>
      )}

      <SectionTransition>
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerChildren={0.08}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.title}>
                <div className="h-full rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className={cn('inline-flex rounded-2xl p-2.5', stat.iconBg)}>
                      <Icon className={cn('h-5 w-5', stat.iconColor)} />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-500">
                      {typeof stat.change === 'number' && stat.change > 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      {typeof stat.change === 'number'
                        ? `${Math.abs(stat.change).toFixed(1)}${stat.title === 'Team Members' ? '' : '%'} ${stat.changeLabel}`
                        : stat.changeLabel}
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{stat.title}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </SectionTransition>

      <SectionTransition>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {todayVisits.length > 0
                  ? "Today's Service Schedule"
                  : 'Upcoming Service Schedule'}
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                {visibleSchedule.length} visits
              </span>
            </div>

            <div className="space-y-3">
              {visibleSchedule.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                  No visits scheduled yet. Add your first service visit from Maintenance.
                </p>
              ) : (
                visibleSchedule.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center gap-3 rounded-xl bg-[#f6fbf7] p-3 transition-colors hover:bg-[#edf8f0]"
                  >
                    <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Clock className="mr-1 h-3 w-3 text-emerald-600" />
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {formatTimeLabel(visit.scheduledDate)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {visit.plant?.location?.client?.companyName ?? 'Client account'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{visit.plant?.location?.name ?? 'Site location'}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Technician: {visit.technician?.user?.name ?? 'Unassigned'}
                      </p>
                    </div>

                    <StatusBadge status={visit.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Live Activity Feed</h3>
              <span className="text-xs font-medium text-emerald-700">
                Revenue {formatCurrency(overviewQuery.data?.monthlyRevenue ?? 0)}
              </span>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                  Activity appears as service visits are created and updated.
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 rounded-xl bg-[#f6fbf7] p-3">
                    <ActivityIcon status={activity.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700">{activity.description}</p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">{activity.detail}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">{activity.timeAgo}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SectionTransition>

      <SectionTransition>
        <RevealBlock>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Quick Actions</h3>
        </RevealBlock>

        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerChildren={0.08}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <StaggerItem key={action.title}>
                <Link
                  href={action.href}
                  className="group relative block h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5 transition-all hover:border-emerald-200 hover:shadow-emerald-600/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className={cn('relative mb-3 inline-flex rounded-2xl p-2.5', action.bg)}>
                    <Icon className={cn('h-5 w-5', action.color)} />
                  </div>
                  <h4 className="relative text-sm font-semibold text-slate-900">{action.title}</h4>
                  <p className="relative mt-1 text-xs text-slate-500">{action.description}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </SectionTransition>

      <SectionTransition>
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-emerald-900/5">
          <p className="text-sm text-slate-600">
            {maintenanceQuery.data
              ? `Current completion rate is ${maintenanceQuery.data.completionRate.toFixed(1)}% with average technician rating ${maintenanceQuery.data.averageRating.toFixed(1)}.`
              : 'Live operational summary updates automatically as your service data changes.'}
          </p>
        </div>
      </SectionTransition>
    </div>
  );
}
