'use client';

import { motion } from 'framer-motion';
import {
  CreditCard,
  Calendar,
  ArrowUpRight,
  Check,
  Download,
  Sprout,
  MapPin,
  Star,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const currentPlan = {
  name: 'Professional',
  billingCycle: 'Monthly',
  nextBillingDate: 'April 1, 2026',
  amount: 14999,
  plantsUsed: 142,
  plantsLimit: 200,
  locationsUsed: 3,
  locationsLimit: 5,
};

const billingHistory = [
  { id: 'INV-2026-0350', date: '2026-03-01', amount: 14999, status: 'paid' as const },
  { id: 'INV-2026-0312', date: '2026-02-01', amount: 14999, status: 'paid' as const },
  { id: 'INV-2026-0274', date: '2026-01-01', amount: 14999, status: 'paid' as const },
  { id: 'INV-2025-0236', date: '2025-12-01', amount: 14999, status: 'paid' as const },
  { id: 'INV-2025-0198', date: '2025-11-01', amount: 14999, status: 'paid' as const },
  { id: 'INV-2025-0160', date: '2025-10-01', amount: 12999, status: 'paid' as const },
];

const availablePlans = [
  {
    name: 'Starter',
    price: 4999,
    features: ['Up to 50 plants', 'Basic monitoring', 'Monthly maintenance', 'Email support'],
    current: false,
  },
  {
    name: 'Professional',
    price: 14999,
    features: ['Up to 200 plants', 'AI health monitoring', 'Weekly maintenance', 'Priority support', 'ESG reports'],
    current: true,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 49999,
    features: ['Unlimited plants', 'Advanced AI analytics', 'Daily maintenance', 'Dedicated manager', 'Custom ESG reporting', 'API access'],
    current: false,
  },
];

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

/* -------------------------------------------------------------------------- */
/*  Progress Bar                                                               */
/* -------------------------------------------------------------------------- */

function UsageBar({
  label,
  used,
  limit,
  icon: Icon,
  color,
}: {
  label: string;
  used: number;
  limit: number;
  icon: React.ElementType;
  color: string;
}) {
  const percent = Math.round((used / limit) * 100);
  const isHigh = percent > 80;

  return (
    <div className="rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', color)} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {used} / {limit}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            isHigh
              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
              : 'bg-gradient-to-r from-emerald-500 to-green-500',
          )}
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-400">
        {percent}% used {isHigh && '- Consider upgrading'}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ClientSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription"
        description="Manage your subscription plan and billing."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'Subscription' },
        ]}
      />

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-green-50 p-6 shadow-lg dark:border-emerald-500/20 dark:from-emerald-500/5 dark:to-green-500/5"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentPlan.name} Plan
                  </h3>
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    ACTIVE
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentPlan.billingCycle} billing
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatINR(currentPlan.amount)}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              Next billing: {currentPlan.nextBillingDate}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Usage Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Usage</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <UsageBar
            label="Plants"
            used={currentPlan.plantsUsed}
            limit={currentPlan.plantsLimit}
            icon={Sprout}
            color="text-emerald-600"
          />
          <UsageBar
            label="Locations"
            used={currentPlan.locationsUsed}
            limit={currentPlan.locationsLimit}
            icon={MapPin}
            color="text-sky-600"
          />
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Billing History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {billingHistory.map((invoice) => (
                <tr key={invoice.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-3.5 text-sm font-mono font-medium text-gray-900 dark:text-white">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {formatINR(invoice.amount)}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                      <Download className="h-3 w-3" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Upgrade Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Available Plans
        </h3>
        <div className="grid gap-6 lg:grid-cols-3">
          {availablePlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={cn(
                'relative rounded-2xl border p-6',
                plan.current
                  ? 'border-emerald-300 bg-emerald-50/50 shadow-lg shadow-emerald-500/5 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                  : 'border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/25">
                    <Star className="h-3 w-3 fill-current" />
                    CURRENT PLAN
                  </span>
                </div>
              )}

              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h4>
              <p className="mt-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatINR(plan.price)}
                </span>
                <span className="text-sm text-gray-500">/mo</span>
              </p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className={cn('h-4 w-4', plan.current ? 'text-emerald-600' : 'text-gray-400')} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.current}
                className={cn(
                  'mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all',
                  plan.current
                    ? 'cursor-default bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300',
                )}
              >
                {plan.current ? (
                  'Current Plan'
                ) : plan.price > currentPlan.amount ? (
                  <>
                    Upgrade <ArrowUpRight className="h-4 w-4" />
                  </>
                ) : (
                  'Downgrade'
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
