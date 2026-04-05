'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  IndianRupee,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { cn } from '@/lib/utils';

type PlanType = 'starter' | 'growth' | 'premium' | 'enterprise';
type SubStatus = 'active' | 'trial' | 'past_due' | 'cancelled' | 'paused';

interface SubscriptionRow {
  id: string;
  clientName: string;
  company: string;
  plan: PlanType;
  planLabel: string;
  status: SubStatus;
  billingCycle: string;
  nextPayment: string;
  amount: number;
}

const PLAN_STYLES: Record<PlanType, { label: string; className: string }> = {
  starter: { label: 'Starter', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
  growth: { label: 'Growth', className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' },
  premium: { label: 'Premium', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400' },
  enterprise: { label: 'Enterprise', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
};

const STATUS_STYLES: Record<SubStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  trial: { label: 'Trial', className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' },
  past_due: { label: 'Past Due', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' },
  paused: { label: 'Paused', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
};

function normalizeTier(value?: string): PlanType {
  const tier = (value || '').toLowerCase();

  if (tier.includes('enterprise')) return 'enterprise';
  if (tier.includes('premium')) return 'premium';
  if (tier.includes('growth')) return 'growth';
  return 'starter';
}

function normalizeStatus(value?: string): SubStatus {
  const status = (value || '').toLowerCase();

  if (status.includes('trial')) return 'trial';
  if (status.includes('pause')) return 'paused';
  if (status.includes('cancel')) return 'cancelled';
  if (status.includes('expired') || status.includes('past') || status.includes('overdue')) {
    return 'past_due';
  }

  return 'active';
}

function formatCycle(value?: string): string {
  const cycle = (value || 'monthly').toLowerCase();
  return cycle.charAt(0).toUpperCase() + cycle.slice(1);
}

export default function AdminSubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const subscriptionsQuery = useSubscriptions({
    page: 1,
    pageSize: 300,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const rows = useMemo<SubscriptionRow[]>(() => {
    return (subscriptionsQuery.data?.subscriptions ?? []).map((subscription) => {
      const clientUser = subscription.client?.user as
        | { name?: string; fullName?: string }
        | undefined;
      const planTier = normalizeTier(subscription.plan?.tier || subscription.plan?.name);

      return {
        id: subscription.id,
        clientName: clientUser?.name || clientUser?.fullName || 'Client User',
        company: subscription.client?.companyName || 'Unnamed Company',
        plan: planTier,
        planLabel: subscription.plan?.name || PLAN_STYLES[planTier].label,
        status: normalizeStatus(String(subscription.status)),
        billingCycle: formatCycle(subscription.billingCycle),
        nextPayment: subscription.nextBillingDate || '',
        amount: typeof subscription.monthlyAmount === 'number' ? subscription.monthlyAmount : 0,
      };
    });
  }, [subscriptionsQuery.data?.subscriptions]);

  const filtered = useMemo(
    () =>
      rows.filter(
        (item) =>
          item.clientName.toLowerCase().includes(search.toLowerCase()) ||
          item.company.toLowerCase().includes(search.toLowerCase()) ||
          item.planLabel.toLowerCase().includes(search.toLowerCase()),
      ),
    [rows, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Manage client subscriptions from live billing records."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Subscriptions' },
        ]}
      />

      {subscriptionsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live subscriptions...
        </div>
      )}

      {subscriptionsQuery.isError && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          Unable to load subscriptions right now.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100/80 dark:border-white/5">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Client</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Plan</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Billing</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Next Payment</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80 dark:divide-white/5">
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">No subscriptions found</p>
                    <p className="mt-1 text-xs text-gray-500">Live subscription records will appear here.</p>
                  </td>
                </tr>
              )}

              {paginated.map((subscription) => (
                <tr
                  key={subscription.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{subscription.clientName}</p>
                      <p className="text-xs text-gray-500">{subscription.company}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', PLAN_STYLES[subscription.plan].className)}>
                      <CreditCard className="h-3 w-3" />
                      {subscription.planLabel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_STYLES[subscription.status].className)}>
                      {STATUS_STYLES[subscription.status].label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400 capitalize">
                    {subscription.billingCycle}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {subscription.nextPayment
                        ? new Date(subscription.nextPayment).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {subscription.amount.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <button
                      aria-label={`Open actions for ${subscription.clientName}`}
                      title={`Open actions for ${subscription.clientName}`}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200/60 px-5 py-3 dark:border-white/5">
          <p className="text-xs text-gray-500">
            Showing {filtered.length === 0 ? 0 : page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              aria-label="Previous page"
              title="Previous page"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={cn(
                  'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                  page === index
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5',
                )}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
              title="Next page"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-white/5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
