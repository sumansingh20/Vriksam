'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CalendarCheck,
  Building2,
  Home,
  Briefcase,
  Mail,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface ClientRow {
  id: string;
  companyName?: string | null;
  type?: string | null;
  status?: string | null;
  city?: string | null;
  contactPerson?: string | null;
  user?: {
    name?: string;
    email?: string;
  };
  _count?: {
    locations?: number;
    subscriptions?: number;
    invoices?: number;
  };
}

function toTitle(value?: string | null) {
  if (!value) return 'Unknown';
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_GRADIENTS = [
  'from-emerald-400 to-green-600',
  'from-teal-400 to-cyan-600',
  'from-violet-400 to-purple-600',
  'from-sky-400 to-blue-600',
  'from-amber-400 to-orange-600',
  'from-rose-400 to-red-600',
  'from-green-400 to-emerald-600',
  'from-indigo-400 to-blue-600',
];

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ElementType; classes: string }> = {
    Corporate: {
      icon: Building2,
      classes: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    },
    Residential: {
      icon: Home,
      classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    },
    Commercial: {
      icon: Briefcase,
      classes: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
    },
  };

  const resolved = config[type] ?? {
    icon: Building2,
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  };
  const Icon = resolved.icon;
  const classes = resolved.classes;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        classes,
      )}
    >
      <Icon className="h-3 w-3" />
      {type}
    </span>
  );
}

function SubscriptionBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    Inactive: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  };

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold',
        config[status] || config.Active,
      )}
    >
      {status}
    </span>
  );
}

export default function PartnerClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const clientsQuery = useQuery({
    queryKey: ['partner', 'clients', 'live-list'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<ClientRow[]> & { pagination?: unknown }>(
        '/clients',
        {
          params: {
            page: 1,
            limit: 120,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const rows = useMemo(
    () =>
      (clientsQuery.data ?? []).map((client, index) => {
        const displayName =
          client.user?.name || client.contactPerson || client.companyName || 'Client';

        return {
          id: client.id,
          name: displayName,
          initials: initials(displayName),
          company: client.companyName || 'Unnamed company',
          type: toTitle(client.type),
          locations: client._count?.locations ?? 0,
          subscriptions: client._count?.subscriptions ?? 0,
          invoices: client._count?.invoices ?? 0,
          subscription: toTitle(client.status),
          email: client.user?.email || 'No email available',
          avatarBg: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
        };
      }),
    [clientsQuery.data],
  );

  const filteredClients = useMemo(
    () =>
      rows.filter((client) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          q.length === 0 ||
          client.name.toLowerCase().includes(q) ||
          client.company.toLowerCase().includes(q) ||
          client.email.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === 'All' || client.subscription === statusFilter;
        const matchesType = typeFilter === 'All' || client.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      }),
    [rows, searchQuery, statusFilter, typeFilter],
  );

  const clientStats = useMemo(() => {
    const totalClients = rows.length;
    const active = rows.filter((item) => item.subscription === 'Active').length;
    const pending = rows.filter((item) => item.subscription === 'Pending').length;
    const activeRate = totalClients > 0 ? (active / totalClients) * 100 : 0;

    return [
      {
        label: 'Total Clients',
        value: totalClients,
        icon: Users,
        color: 'text-emerald-600',
        bg: 'bg-emerald-500/10',
      },
      {
        label: 'Active',
        value: active,
        icon: Users,
        color: 'text-green-600',
        bg: 'bg-green-500/10',
      },
      {
        label: 'Pending',
        value: pending,
        icon: UserPlus,
        color: 'text-teal-600',
        bg: 'bg-teal-500/10',
      },
      {
        label: 'Active Rate',
        value: `${activeRate.toFixed(1)}%`,
        icon: Users,
        color: 'text-sky-600',
        bg: 'bg-sky-500/10',
      },
    ];
  }, [rows]);

  const statusFilters = ['All', 'Active', 'Inactive', 'Pending'] as const;
  const typeFilters = ['All', 'Corporate', 'Residential', 'Commercial'] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Management"
        description="Live client portfolio with account health and subscription visibility."
        breadcrumbs={[
          { label: 'Partner', href: '/partner' },
          { label: 'Clients' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => clientsQuery.refetch()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Clients
          </button>
        }
      />

      {clientsQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load live clients right now. Please retry in a moment.
        </div>
      )}

      {clientsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live clients...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clientStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className={cn('mb-3 inline-flex rounded-xl p-2.5', stat.bg)}>
                <Icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients by name, company, or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter clients by status"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {statusFilters.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : status}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter clients by type"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {typeFilters.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Client</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Type</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Locations</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Subscriptions</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Contact</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
              {filteredClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white',
                          client.avatarBg,
                        )}
                      >
                        {client.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.company}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <TypeBadge type={client.type} />
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{client.locations}</span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{client.subscriptions}</span>
                  </td>

                  <td className="px-5 py-4">
                    <SubscriptionBadge status={client.subscription} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === client.id ? null : client.id)}
                        aria-label={`Open actions for ${client.name}`}
                        title={`Open actions for ${client.name}`}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {openDropdown === client.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-gray-900"
                          >
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
                              <Eye className="h-3.5 w-3.5" />
                              View Profile
                            </button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
                              <CalendarCheck className="h-3.5 w-3.5" />
                              Schedule Visit
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && !clientsQuery.isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No clients found</p>
            <p className="mt-1 text-xs text-gray-400">Try adjusting search or filters.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
