'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type PlanType = 'starter' | 'growth' | 'premium' | 'enterprise';
type SubStatus = 'active' | 'trial' | 'past_due' | 'cancelled';
type BillingCycle = 'monthly' | 'quarterly' | 'annual';

interface Subscription {
  id: string;
  clientName: string;
  company: string;
  plan: PlanType;
  status: SubStatus;
  billingCycle: BillingCycle;
  nextPayment: string;
  amount: number;
}

/* -------------------------------------------------------------------------- */
/*  Style config                                                              */
/* -------------------------------------------------------------------------- */

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
};

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const subscriptions: Subscription[] = [
  { id: 'SUB-001', clientName: 'Rahul Mehta', company: 'TechCorp Ltd', plan: 'enterprise', status: 'active', billingCycle: 'annual', nextPayment: '2026-04-15', amount: 120000 },
  { id: 'SUB-002', clientName: 'Anita Desai', company: 'GreenSpace Inc', plan: 'premium', status: 'active', billingCycle: 'quarterly', nextPayment: '2026-04-01', amount: 45000 },
  { id: 'SUB-003', clientName: 'Vikram Singh', company: 'EcoVentures', plan: 'growth', status: 'trial', billingCycle: 'monthly', nextPayment: '2026-03-28', amount: 15000 },
  { id: 'SUB-004', clientName: 'Priya Nair', company: 'Wellness Hub', plan: 'enterprise', status: 'active', billingCycle: 'annual', nextPayment: '2026-06-20', amount: 180000 },
  { id: 'SUB-005', clientName: 'Amit Joshi', company: 'Metro Living', plan: 'starter', status: 'active', billingCycle: 'monthly', nextPayment: '2026-04-05', amount: 5000 },
  { id: 'SUB-006', clientName: 'Sunita Rao', company: 'Govt. Municipal Corp', plan: 'enterprise', status: 'active', billingCycle: 'annual', nextPayment: '2026-08-10', amount: 250000 },
  { id: 'SUB-007', clientName: 'Kiran Patel', company: 'StartUp Valley', plan: 'growth', status: 'past_due', billingCycle: 'monthly', nextPayment: '2026-03-01', amount: 15000 },
  { id: 'SUB-008', clientName: 'Deepak Kumar', company: 'Regal Hotels', plan: 'premium', status: 'active', billingCycle: 'quarterly', nextPayment: '2026-05-15', amount: 65000 },
  { id: 'SUB-009', clientName: 'Meera Shah', company: 'InfoSys Garden', plan: 'premium', status: 'active', billingCycle: 'monthly', nextPayment: '2026-04-10', amount: 35000 },
  { id: 'SUB-010', clientName: 'Arjun Reddy', company: 'Palm Residences', plan: 'starter', status: 'cancelled', billingCycle: 'monthly', nextPayment: '-', amount: 5000 },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminSubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const filtered = subscriptions.filter(
    (s) =>
      s.clientName.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Manage client subscription plans, billing, and payment status."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Subscriptions' },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        {/* Search */}
        <div className="border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Table */}
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
              {paginated.map((sub) => (
                <tr
                  key={sub.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{sub.clientName}</p>
                      <p className="text-xs text-gray-500">{sub.company}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', PLAN_STYLES[sub.plan].className)}>
                      <CreditCard className="h-3 w-3" />
                      {PLAN_STYLES[sub.plan].label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_STYLES[sub.status].className)}>
                      {STATUS_STYLES[sub.status].label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400 capitalize">
                    {sub.billingCycle}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {sub.nextPayment === '-' ? '-' : new Date(sub.nextPayment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {sub.amount.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200/60 px-5 py-3 dark:border-white/5">
          <p className="text-xs text-gray-500">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                  page === i ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
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
