'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
  Loader2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'stripe' | 'upi' | 'bank_transfer';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface InvoiceApiRow {
  id: string;
  invoiceNumber?: string;
  status?: string;
  issueDate?: string;
  paidDate?: string | null;
  totalAmount?: number;
  amountPaid?: number;
  client?: {
    companyName?: string;
  };
  payments?: Array<{
    id?: string;
    amount?: number;
    method?: string;
    status?: string;
    paidAt?: string;
  }>;
}

interface PaymentRow {
  id: string;
  client: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  invoiceId: string;
}

const STATUS_STYLES: Record<
  PaymentStatus,
  { label: string; className: string; icon: LucideIcon }
> = {
  success: {
    label: 'Success',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    icon: CheckCircle,
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    icon: Clock,
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400',
    icon: XCircle,
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    icon: AlertCircle,
  },
};

const METHOD_STYLES: Record<
  PaymentMethod,
  { label: string; className: string; icon: LucideIcon }
> = {
  stripe: {
    label: 'Stripe',
    className: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    icon: CreditCard,
  },
  upi: {
    label: 'UPI',
    className: 'bg-green-500/10 text-green-700 dark:text-green-400',
    icon: Smartphone,
  },
  bank_transfer: {
    label: 'Bank Transfer',
    className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
    icon: Building,
  },
};

function normalizeStatus(value?: string): PaymentStatus {
  const status = (value || '').toLowerCase();

  if (status.includes('success') || status.includes('paid') || status.includes('completed')) {
    return 'success';
  }

  if (status.includes('refund')) {
    return 'refunded';
  }

  if (status.includes('fail') || status.includes('overdue') || status.includes('cancel')) {
    return 'failed';
  }

  return 'pending';
}

function normalizeMethod(value?: string): PaymentMethod {
  const method = (value || '').toLowerCase();

  if (method.includes('upi')) return 'upi';
  if (method.includes('stripe') || method.includes('card')) return 'stripe';
  return 'bank_transfer';
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function isSameDay(isoDate: string): boolean {
  const current = new Date();
  const value = new Date(isoDate);
  return current.toDateString() === value.toDateString();
}

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const invoicesQuery = useQuery({
    queryKey: ['admin', 'payments', 'invoices'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<InvoiceApiRow[]> & { pagination?: unknown }>(
        '/invoices',
        {
          params: {
            page: 1,
            limit: 300,
            sortBy: 'issueDate',
            sortOrder: 'desc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const payments = useMemo<PaymentRow[]>(() => {
    return (invoicesQuery.data ?? []).map((invoice) => {
      const payment = invoice.payments?.[0];
      const amount =
        (typeof payment?.amount === 'number' ? payment.amount : undefined) ??
        (typeof invoice.totalAmount === 'number' ? invoice.totalAmount : undefined) ??
        (typeof invoice.amountPaid === 'number' ? invoice.amountPaid : 0);

      const rawStatus = payment?.status || invoice.status || 'PENDING';
      const rawMethod = payment?.method || 'BANK_TRANSFER';
      const paidDate = payment?.paidAt || invoice.paidDate || invoice.issueDate || '';

      return {
        id: payment?.id || invoice.id,
        client: invoice.client?.companyName || 'Client account',
        amount,
        method: normalizeMethod(rawMethod),
        status: normalizeStatus(rawStatus),
        date: paidDate,
        invoiceId: invoice.invoiceNumber || invoice.id,
      };
    });
  }, [invoicesQuery.data]);

  const filtered = useMemo(
    () =>
      payments.filter((payment) => {
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        const matchesSearch =
          searchQuery === '' ||
          payment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
      }),
    [payments, searchQuery, statusFilter],
  );

  const totalRevenue = useMemo(
    () => payments.filter((payment) => payment.status === 'success').reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );

  const pendingAmount = useMemo(
    () => payments.filter((payment) => payment.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );

  const processedToday = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === 'success' && payment.date && isSameDay(payment.date))
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );

  const failedCount = useMemo(
    () => payments.filter((payment) => payment.status === 'failed').length,
    [payments],
  );

  const exportPaymentsCsv = () => {
    if (filtered.length === 0) return;

    const headers = [
      'Payment ID',
      'Invoice ID',
      'Client',
      'Amount',
      'Method',
      'Status',
      'Date',
    ];

    const rows = filtered.map((payment) => [
      payment.id,
      payment.invoiceId,
      payment.client,
      payment.amount.toFixed(2),
      METHOD_STYLES[payment.method].label,
      STATUS_STYLES[payment.status].label,
      payment.date,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track live invoice and payment activity."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Payments' },
        ]}
        actions={
          <button
            type="button"
            onClick={exportPaymentsCsv}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200/60 backdrop-blur-xl transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800/80 dark:text-gray-300 dark:ring-white/10"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      {invoicesQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live payment data...
        </div>
      )}

      {invoicesQuery.isError && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          Unable to load invoices and payments.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total Revenue',
            value: formatINR(totalRevenue),
            icon: IndianRupee,
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
            change: `${payments.filter((payment) => payment.status === 'success').length} successful`,
          },
          {
            label: 'Pending Amount',
            value: formatINR(pendingAmount),
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-500/10',
            change: `${payments.filter((payment) => payment.status === 'pending').length} pending`,
          },
          {
            label: 'Processed Today',
            value: formatINR(processedToday),
            icon: TrendingUp,
            color: 'text-sky-600',
            bg: 'bg-sky-500/10',
            change: 'Live daily total',
          },
          {
            label: 'Failed',
            value: `${failedCount}`,
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-500/10',
            change: 'Needs attention',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
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
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by client or ID..."
            className="w-full rounded-xl border border-gray-200/60 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900/50 dark:text-white sm:w-64"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">ID</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Client</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Method</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.map((payment, index) => {
                const status = STATUS_STYLES[payment.status];
                const method = METHOD_STYLES[payment.method];
                const StatusIcon = status.icon;
                const MethodIcon = method.icon;

                return (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900 dark:text-white">{payment.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{payment.client}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">{formatINR(payment.amount)}</td>
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
                      {payment.date
                        ? new Date(payment.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <FileText className="h-3 w-3" />
                        {payment.invoiceId}
                      </span>
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
