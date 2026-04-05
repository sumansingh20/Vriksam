'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowUpRight,
  IndianRupee,
  Loader2,
  ShieldCheck,
  Sprout,
  Users,
  Wrench,
} from 'lucide-react';
import {
  RevealBlock,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/section-transition';
import { RevenueChart, type RevenueDataPoint } from '@/components/dashboard/revenue-chart';
import { PlantHealthChart, type PlantHealthData } from '@/components/dashboard/plant-health-chart';
import { RecentActivity, type ActivityItem } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { PageHeader } from '@/components/layout/page-header';
import {
  useMaintenanceMetrics,
  useOverviewStats,
  usePlantMetrics,
  useRevenueData,
} from '@/hooks/use-analytics';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface ServiceVisitLite {
  id: string;
  status: string;
  updatedAt?: string;
  createdAt?: string;
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

function formatCurrency(value: number) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
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

function formatPeriodLabel(period: string) {
  const [year, month] = period.split('-').map(Number);
  if (!year || !month) return period;

  return new Date(year, month - 1, 1).toLocaleString('en-IN', {
    month: 'short',
  });
}

function toActivityType(status: string): ActivityItem['type'] {
  if (status === 'MISSED' || status === 'CANCELLED') return 'health_alert';
  if (status === 'COMPLETED') return 'maintenance';
  return 'plant';
}

function OverviewCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5">
      <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-emerald-100/60 blur-xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className={cn('rounded-2xl p-2.5', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const overviewQuery = useOverviewStats();
  const revenueQuery = useRevenueData({ period: 'monthly' });
  const plantQuery = usePlantMetrics();
  const maintenanceQuery = useMaintenanceMetrics();

  const recentVisitsQuery = useQuery({
    queryKey: ['admin', 'dashboard', 'recent-visits'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<ServiceVisitLite[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 10,
            sortBy: 'updatedAt',
            sortOrder: 'desc',
          },
        },
      );
      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const revenueChartData = useMemo<RevenueDataPoint[]>(
    () =>
      (revenueQuery.data?.revenueTrend ?? []).map((item) => ({
        name: formatPeriodLabel(item.period),
        revenue: item.revenue,
      })),
    [revenueQuery.data],
  );

  const plantHealthData = useMemo<PlantHealthData[]>(
    () =>
      Object.entries(plantQuery.data?.statusDistribution ?? {}).map(
        ([name, value], index) => {
          const palette = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];
          return {
            name: name
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase()),
            value,
            color: palette[index % palette.length] || '#10b981',
          };
        },
      ),
    [plantQuery.data],
  );

  const activities = useMemo<ActivityItem[]>(
    () =>
      (recentVisitsQuery.data ?? []).map((visit) => {
        const clientName = visit.plant?.location?.client?.companyName ?? 'Client account';
        const locationName = visit.plant?.location?.name ?? 'Site location';
        const statusText = visit.status.toLowerCase().replace(/_/g, ' ');

        return {
          id: visit.id,
          type: toActivityType(visit.status),
          description: `${statusText[0]?.toUpperCase() ?? ''}${statusText.slice(1)} visit for ${clientName}`,
          timeAgo: formatTimeAgo(visit.updatedAt || visit.createdAt),
          user: visit.technician?.user?.name || locationName,
        };
      }),
    [recentVisitsQuery.data],
  );

  const isLoading =
    overviewQuery.isLoading ||
    revenueQuery.isLoading ||
    plantQuery.isLoading ||
    maintenanceQuery.isLoading;

  const hasError =
    overviewQuery.isError ||
    revenueQuery.isError ||
    plantQuery.isError ||
    maintenanceQuery.isError ||
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
            title="Admin Operations Command"
            description="Unified visibility across clients, revenue, maintenance execution, and plant health outcomes."
            showAccent={false}
            className="mb-0"
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Collection Rate</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {revenueQuery.data ? `${revenueQuery.data.collectionRate.toFixed(1)}%` : '--'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Open Visits</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{overviewQuery.data?.pendingVisits ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Critical Plants</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{overviewQuery.data?.criticalPlants ?? 0}</p>
            </div>
          </div>
        </div>
      </SectionTransition>

      {hasError && (
        <RevealBlock>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Some live feeds are unavailable right now. Available widgets are rendered using the latest successful responses.
          </div>
        </RevealBlock>
      )}

      {isLoading && (
        <RevealBlock>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading live admin dashboard data...
          </div>
        </RevealBlock>
      )}

      <SectionTransition>
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerChildren={0.08}>
          <StaggerItem>
            <OverviewCard
              title="Total Clients"
              value={overviewQuery.data?.totalClients ?? 0}
              subtitle={`${overviewQuery.data?.activeClients ?? 0} active clients`}
              icon={Users}
              iconColor="text-sky-600"
              iconBg="bg-sky-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <OverviewCard
              title="Active Plants"
              value={(overviewQuery.data?.totalPlants ?? 0).toLocaleString('en-IN')}
              subtitle={`${overviewQuery.data?.healthyPlants ?? 0} healthy | ${overviewQuery.data?.criticalPlants ?? 0} critical`}
              icon={Sprout}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <OverviewCard
              title="Monthly Revenue"
              value={formatCurrency(overviewQuery.data?.monthlyRevenue ?? 0)}
              subtitle={`${revenueQuery.data?.revenueGrowth ?? 0}% growth this period`}
              icon={IndianRupee}
              iconColor="text-violet-600"
              iconBg="bg-violet-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <OverviewCard
              title="Active Technicians"
              value={overviewQuery.data?.activeTechnicians ?? 0}
              subtitle={`${maintenanceQuery.data?.completionRate ?? 0}% completion rate`}
              icon={Wrench}
              iconColor="text-amber-600"
              iconBg="bg-amber-500/10"
            />
          </StaggerItem>
        </StaggerContainer>
      </SectionTransition>

      <SectionTransition>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-lg shadow-emerald-900/5">
            <RevenueChart data={revenueChartData} />
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-lg shadow-emerald-900/5">
            <PlantHealthChart data={plantHealthData} />
          </div>
        </div>
      </SectionTransition>

      <SectionTransition>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-lg shadow-emerald-900/5 lg:col-span-2">
            <RecentActivity activities={activities} maxHeight="380px" />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-lg shadow-emerald-900/5">
              <QuickActions onAction={(href) => router.push(href)} />
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-emerald-900/5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                {revenueQuery.data
                  ? `Collection rate is ${revenueQuery.data.collectionRate.toFixed(1)}% with outstanding amount ${formatCurrency(revenueQuery.data.outstandingAmount)}.`
                  : 'Revenue and collection summary updates automatically from live payment and invoice data.'}
              </div>
              {(maintenanceQuery.data?.missedVisitRate ?? 0) > 10 && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  Missed visit rate is above 10%. Review technician schedules and SLA coverage.
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Data updates in near real time
              </div>
            </div>
          </div>
        </div>
      </SectionTransition>
    </div>
  );
}
