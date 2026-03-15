'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  CreditCard,
  Smartphone,
  Building,
  FileText,
  Search,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'stripe' | 'upi' | 'bank_transfer';

interface Payment {
  id: string;
  client: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  invoiceId: string;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const payments: Payment[] = [
  { id: 'PAY-001', client: 'TechCorp Ltd', amount: 49999, method: 'stripe', status: 'success', date: '2026-03-15', invoiceId: 'INV-2026-0389' },
  { id: 'PAY-002', client: 'GreenSpace Inc', amount: 14999, method: 'upi', status: 'success', date: '2026-03-15', invoiceId: 'INV-2026-0388' },
  { id: 'PAY-003', client: 'Regal Hotels', amount: 149999, method: 'bank_transfer', status: 'pending', date: '2026-03-14', invoiceId: 'INV-2026-0387' },
  { id: 'PAY-004', client: 'InfoSys Garden', amount: 14999, method: 'stripe', status: 'success', date: '2026-03-14', invoiceId: 'INV-2026-0386' },
  { id: 'PAY-005', client: 'Metro Living', amount: 4999, method: 'upi', status: 'failed', date: '2026-03-13', invoiceId: 'INV-2026-0385' },
  { id: 'PAY-006', client: 'Wellness Hub', amount: 14999, method: 'stripe', status: 'success', date: '2026-03-13', invoiceId: 'INV-2026-0384' },
  { id: 'PAY-007', client: 'Palm Residences', amount: 49999, method: 'bank_transfer', status: 'refunded', date: '2026-03-12', invoiceId: 'INV-2026-0383' },
  { id: 'PAY-008', client: 'StartUp Valley', amount: 4999, method: 'upi', status: 'success', date: '2026-03-12', invoiceId: 'INV-2026-0382' },
  { id: 'PAY-009', client: 'EcoVentures', amount: 14999, method: 'stripe', status: 'pending', date: '2026-03-11', invoiceId: 'INV-2026-0381' },
  { id: 'PAY-010', client: 'CloudNine Offices', amount: 49999, method: 'bank_transfer', status: 'success', date: '2026-03-11', invoiceId: 'INV-2026-0380' },
];

/* -------------------------------------------------------------------------- */
/*  Config                                                                     */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES: Record<PaymentStatus, { label: string; className: string; icon: React.ElementType }> = {
  success: { label: 'Success', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', icon: CheckCircle },
  pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', icon: Clock },
  failed: { label: 'Failed', className: 'bg-red-500/10 text-red-700 dark:text-red-400', icon: XCircle },
  refunded: { label: 'Refunded', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400', icon: AlertCircle },
};

const METHOD_STYLES: Record<PaymentMethod, { label: string; className: string; icon: React.ElementType }> = {
  stripe: { label: 'Stripe', className: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400', icon: CreditCard },
  upi: { label: 'UPI', className: 'bg-green-500/10 text-green-700 dark:text-green-400', icon: Smartphone },
  bank_transfer: { label: 'Bank Transfer', className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400', icon: Building },
};

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = payments.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = payments.filter((p) => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const processedToday = payments.filter((p) => p.date === '2026-03-15' && p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const failedCount = payments.filter((p) => p.status === 'failed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track and manage all payment transactions."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Payments' },
        ]}
        actions={
          <button className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200/60 backdrop-blur-xl transition-all hover:bg-white dark:bg-gray-800/80 dark:text-gray-300 dark:ring-white/10">
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Revenue', value: formatINR(totalRevenue), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-500/10', change: '+15.2%' },
          { label: 'Pending Amount', value: formatINR(pendingAmount), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10', change: '2 pending' },
          { label: 'Processed Today', value: formatINR(processedToday), icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-500/10', change: '2 transactions' },
          { label: 'Failed', value: `${failedCount}`, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10', change: 'Needs attention' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className={cn('mb-3 inline-flex rounded-xl p-2.5', stat.bg)}>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {(['all', 'success', 'pending', 'failed', 'refunded'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                statusFilter === status
                  ? 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400',
              )}
            >
              {status === 'all' ? 'All' : STATUS_STYLES[status].label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or ID..."
            className="w-full rounded-xl border border-gray-200/60 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900/50 dark:text-white sm:w-64"
          />
        </div>
      </div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  ID
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Client
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Method
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.map((payment, i) => {
                const status = STATUS_STYLES[payment.status];
                const method = METHOD_STYLES[payment.method];
                const StatusIcon = status.icon;
                const MethodIcon = method.icon;

                return (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900 dark:text-white">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {payment.client}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      {formatINR(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', method.className)}>
                        <MethodIcon className="h-3 w-3" />
                        {method.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                        <FileText className="h-3 w-3" />
                        {payment.invoiceId}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No payments found matching your filters.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
