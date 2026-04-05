'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Award,
  Calendar,
  CloudRain,
  CreditCard,
  Heart,
  Loader2,
  TreePine,
  Wind,
} from 'lucide-react';
import {
  RevealBlock,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/section-transition';
import { PlantHealthChart, type PlantHealthData } from '@/components/dashboard/plant-health-chart';
import {
  MaintenanceCalendar,
  type MaintenanceStatus,
  type MaintenanceVisit,
} from '@/components/dashboard/maintenance-calendar';
import { PageHeader } from '@/components/layout/page-header';
import { useESGMetrics, useOverviewStats, usePlantMetrics } from '@/hooks/use-analytics';
import { useAuth } from '@/hooks/use-auth';
import maintenanceService from '@/services/maintenance.service';
import subscriptionsService from '@/services/subscriptions.service';
import { cn } from '@/lib/utils';

function QuickStat({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="h-full rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5">
      <div className={cn('mb-3 inline-flex rounded-2xl p-2.5', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

function ESGSummaryCard({
  co2Absorbed,
  oxygenProduced,
  greenScore,
  airPurifyingScore,
}: {
  co2Absorbed: number;
  oxygenProduced: number;
  greenScore: number;
  airPurifyingScore: number;
}) {
  const metrics = [
    {
      icon: CloudRain,
      label: 'CO2 Absorbed',
      value: `${Math.round(co2Absorbed)} kg`,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Wind,
      label: 'O2 Produced',
      value: `${Math.round(oxygenProduced)} kg`,
      color: 'text-sky-600',
      bg: 'bg-sky-500/10',
    },
    {
      icon: Award,
      label: 'Green Score',
      value: `${Math.round(greenScore)}/100`,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Heart,
      label: 'Air Wellness',
      value: `${Math.round(airPurifyingScore)}%`,
      color: 'text-rose-600',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="h-full rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5">
      <h3 className="text-sm font-semibold text-slate-900">ESG Impact Summary</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-2xl bg-[#f6fbf7] p-3">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', metric.bg)}>
                  <Icon className={cn('h-4 w-4', metric.color)} />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{metric.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HEALTH_COLORS: Record<string, string> = {
  healthy: '#10b981',
  needs_attention: '#f59e0b',
  needsattention: '#f59e0b',
  attention: '#f59e0b',
  critical: '#ef4444',
  replaced: '#8b5cf6',
  inactive: '#64748b',
};

const FALLBACK_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#14b8a6'];

function toTitle(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function mapVisitStatus(status: string): MaintenanceStatus {
  const normalized = status.toLowerCase();
  if (normalized.includes('overdue') || normalized.includes('missed')) return 'overdue';
  if (normalized.includes('progress')) return 'in_progress';
  if (normalized.includes('complete')) return 'completed';
  return 'scheduled';
}

function formatVisitDate(value?: string): string {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function formatBillingCycle(cycle?: string): string {
  if (!cycle) return 'Plan details unavailable';
  return `${toTitle(cycle)} billing`;
}

function formatLocationLabel(value: unknown): string {
  if (!value) return 'Location unavailable';
  if (typeof value === 'string') return value;

  if (typeof value === 'object') {
    const location = value as {
      line1?: string;
      city?: string;
      state?: string;
      postalCode?: string;
    };

    const parts = [location.line1, location.city, location.state, location.postalCode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location unavailable';
  }

  return 'Location unavailable';
}

export default function ClientDashboardPage() {
  const { user } = useAuth();

  const overviewQuery = useOverviewStats();
  const plantQuery = usePlantMetrics();
  const esgQuery = useESGMetrics();

  const visitsQuery = useQuery({
    queryKey: ['client', 'dashboard', 'maintenance', 'upcoming'],
    queryFn: async () => {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 30);

      const result = await maintenanceService.getAll({
        page: 1,
        pageSize: 80,
        sortBy: 'scheduledDate',
        sortOrder: 'asc',
        scheduledDateFrom: start.toISOString(),
        scheduledDateTo: end.toISOString(),
      });

      return result.visits;
    },
    staleTime: 60 * 1000,
  });

  const subscriptionQuery = useQuery({
    queryKey: ['client', 'dashboard', 'subscription', 'latest'],
    queryFn: async () => {
      const result = await subscriptionsService.getAll({
        page: 1,
        pageSize: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const active = result.subscriptions.find((subscription) =>
        String(subscription.status ?? '').toLowerCase().includes('active'),
      );

      return active ?? result.subscriptions[0] ?? null;
    },
    staleTime: 2 * 60 * 1000,
  });

  const isLoading =
    overviewQuery.isLoading ||
    plantQuery.isLoading ||
    esgQuery.isLoading ||
    visitsQuery.isLoading ||
    subscriptionQuery.isLoading;

  const hasError =
    overviewQuery.isError ||
    plantQuery.isError ||
    esgQuery.isError ||
    visitsQuery.isError ||
    subscriptionQuery.isError;

  const healthData = useMemo<PlantHealthData[]>(() => {
    const distribution = plantQuery.data?.statusDistribution ?? {};

    return Object.entries(distribution)
      .map(([status, count], index) => {
        const normalized = status.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        return {
          name: toTitle(status),
          value: Number(count ?? 0),
          color: HEALTH_COLORS[normalized] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]!,
        };
      })
      .filter((entry) => entry.value > 0);
  }, [plantQuery.data?.statusDistribution]);

  const maintenanceVisits = useMemo<MaintenanceVisit[]>(() => {
    return (visitsQuery.data ?? [])
      .map((visit) => ({
        id: visit.id,
        date: visit.scheduledDate,
        clientName: visit.client?.companyName || user?.fullName || 'Client',
        location:
          visit.location?.name ||
          formatLocationLabel(visit.location?.address) ||
          'Location unavailable',
        technician: visit.technician?.user?.fullName || 'Assigned technician',
        status: mapVisitStatus(String(visit.status ?? 'scheduled')),
      }))
      .sort(
        (left, right) =>
          new Date(left.date).getTime() - new Date(right.date).getTime(),
      )
      .slice(0, 12);
  }, [visitsQuery.data, user?.fullName]);

  const nextVisit =
    maintenanceVisits.find((visit) => visit.status !== 'completed') ??
    maintenanceVisits[0];

  const totalPlants = overviewQuery.data?.totalPlants ?? 0;
  const healthyPlants = overviewQuery.data?.healthyPlants ?? 0;
  const healthyShare = totalPlants > 0 ? (healthyPlants / totalPlants) * 100 : 0;
  const averageHealthScore = plantQuery.data?.averageHealthScore ?? 0;

  const displayName = useMemo(() => {
    const fallback = 'there';
    const raw = String(user?.firstName || user?.fullName || '').trim();
    if (!raw) return fallback;
    return raw.split(/\s+/)[0] || fallback;
  }, [user?.firstName, user?.fullName]);

  return (
    <div className="space-y-6">
      <SectionTransition className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-[#f4faf5] via-[#f8fcf9] to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-12 h-48 w-48 rounded-full bg-emerald-300/20 blur-[90px]" />
          <div className="absolute right-[-3rem] top-6 h-40 w-40 rounded-full bg-cyan-300/18 blur-[80px]" />
        </div>

        <div className="relative">
          <PageHeader
            title={`Welcome back, ${displayName}`}
            description="Track your plant health, maintenance schedule, subscription status, and environmental outcomes in one place."
            showAccent={false}
            className="mb-0"
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Next Maintenance</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{nextVisit ? formatVisitDate(nextVisit.date) : '--'}</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Current Plan</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {subscriptionQuery.data?.plan?.name || 'No active plan'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Healthy Plants</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{healthyShare.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </SectionTransition>

      {isLoading && (
        <RevealBlock>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your live dashboard data...
          </div>
        </RevealBlock>
      )}

      {hasError && (
        <RevealBlock>
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            Some live widgets are temporarily unavailable. Showing the latest successful data where possible.
          </div>
        </RevealBlock>
      )}

      <SectionTransition>
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerChildren={0.08}>
          <StaggerItem>
            <QuickStat
              icon={TreePine}
              label="My Plants"
              value={`${totalPlants}`}
              subtitle={`${plantQuery.data?.plantsByLocation.length ?? 0} active locations`}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <QuickStat
              icon={Calendar}
              label="Next Maintenance"
              value={nextVisit ? formatVisitDate(nextVisit.date) : '--'}
              subtitle={nextVisit ? `${nextVisit.technician} assigned` : 'No upcoming visits'}
              color="text-sky-600"
              bg="bg-sky-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <QuickStat
              icon={CreditCard}
              label="Subscription"
              value={
                subscriptionQuery.data?.plan?.name ||
                toTitle(String(subscriptionQuery.data?.status || 'No active plan'))
              }
              subtitle={formatBillingCycle(subscriptionQuery.data?.billingCycle)}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <QuickStat
              icon={Heart}
              label="Health Score"
              value={`${Math.round(averageHealthScore)}%`}
              subtitle={`${healthyShare.toFixed(0)}% healthy plants`}
              color="text-rose-600"
              bg="bg-rose-500/10"
            />
          </StaggerItem>
        </StaggerContainer>
      </SectionTransition>

      <SectionTransition>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-lg shadow-emerald-900/5">
            <PlantHealthChart data={healthData} />
          </div>
          <ESGSummaryCard
            co2Absorbed={esgQuery.data?.totalCO2Absorbed ?? 0}
            oxygenProduced={esgQuery.data?.totalO2Produced ?? 0}
            greenScore={esgQuery.data?.greenScore ?? 0}
            airPurifyingScore={esgQuery.data?.averageAirPurifyingScore ?? 0}
          />
        </div>
      </SectionTransition>

      <SectionTransition>
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-lg shadow-emerald-900/5">
          <MaintenanceCalendar visits={maintenanceVisits} />
        </div>
      </SectionTransition>
    </div>
  );
}
