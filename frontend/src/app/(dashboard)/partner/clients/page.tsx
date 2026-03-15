'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CalendarCheck,
  Leaf,
  XCircle,
  TrendingUp,
  UserCheck,
  UserX,
  Building2,
  Home,
  Briefcase,
  Mail,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Client {
  id: string;
  name: string;
  initials: string;
  company: string;
  type: 'Corporate' | 'Residential' | 'Commercial';
  locations: number;
  plants: number;
  subscription: 'Active' | 'Inactive' | 'Pending';
  email: string;
  avatarBg: string;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const clientStats = [
  { label: 'Total Clients', value: 24, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { label: 'Active', value: 21, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-500/10' },
  { label: 'New This Month', value: 3, icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-500/10' },
  { label: 'Retention Rate', value: '96.2%', icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-500/10' },
];

const clients: Client[] = [
  { id: '1', name: 'Rahul Mehta', initials: 'RM', company: 'TechCorp Ltd', type: 'Corporate', locations: 3, plants: 245, subscription: 'Active', email: 'rahul@techcorp.in', avatarBg: 'from-emerald-400 to-green-600' },
  { id: '2', name: 'Arun Kapoor', initials: 'AK', company: 'GreenSpace Inc', type: 'Corporate', locations: 2, plants: 180, subscription: 'Active', email: 'arun@greenspace.com', avatarBg: 'from-teal-400 to-cyan-600' },
  { id: '3', name: 'Meera Patel', initials: 'MP', company: 'Wellness Hub', type: 'Commercial', locations: 1, plants: 92, subscription: 'Active', email: 'meera@wellnesshub.in', avatarBg: 'from-violet-400 to-purple-600' },
  { id: '4', name: 'Sanjay Reddy', initials: 'SR', company: 'EcoVentures', type: 'Corporate', locations: 4, plants: 310, subscription: 'Active', email: 'sanjay@ecoventures.in', avatarBg: 'from-sky-400 to-blue-600' },
  { id: '5', name: 'Priya Nair', initials: 'PN', company: 'Palm Residences', type: 'Residential', locations: 1, plants: 45, subscription: 'Active', email: 'priya@palmres.in', avatarBg: 'from-amber-400 to-orange-600' },
  { id: '6', name: 'Vikram Joshi', initials: 'VJ', company: 'Skyline Towers', type: 'Commercial', locations: 2, plants: 156, subscription: 'Pending', email: 'vikram@skylinetowers.com', avatarBg: 'from-rose-400 to-red-600' },
  { id: '7', name: 'Deepa Singh', initials: 'DS', company: 'Lotus Gardens', type: 'Residential', locations: 1, plants: 78, subscription: 'Active', email: 'deepa@lotusgardens.in', avatarBg: 'from-green-400 to-emerald-600' },
  { id: '8', name: 'Rajesh Kumar', initials: 'RK', company: 'Metro Plaza', type: 'Commercial', locations: 3, plants: 210, subscription: 'Inactive', email: 'rajesh@metroplaza.in', avatarBg: 'from-indigo-400 to-blue-600' },
];

const statusFilters = ['All', 'Active', 'Inactive', 'Pending'] as const;
const typeFilters = ['All', 'Corporate', 'Residential', 'Commercial'] as const;

/* -------------------------------------------------------------------------- */
/*  Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ElementType; classes: string }> = {
    Corporate: { icon: Building2, classes: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
    Residential: { icon: Home, classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
    Commercial: { icon: Briefcase, classes: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400' },
  };
  const { icon: Icon, classes } = (config[type] ?? config.Corporate)!;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', classes)}>
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
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', config[status] ?? config.Active)}>
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PartnerClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || client.subscription === statusFilter;
    const matchesType = typeFilter === 'All' || client.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Management"
        description="Manage your partner clients, subscriptions, and locations."
        breadcrumbs={[
          { label: 'Partner', href: '/dashboard/partner' },
          { label: 'Clients' },
        ]}
        actions={
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
            <UserPlus className="h-4 w-4" />
            Add Client
          </button>
        }
      />

      {/* Stats Summary */}
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

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients by name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            onChange={(e) => setTypeFilter(e.target.value)}
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

      {/* Client Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Client</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Type</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Locations</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Plants</th>
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
                  transition={{ delay: 0.25 + index * 0.03 }}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  {/* Name + Company */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white', client.avatarBg)}>
                        {client.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.company}</p>
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="px-5 py-4">
                    <TypeBadge type={client.type} />
                  </td>
                  {/* Locations */}
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{client.locations}</span>
                  </td>
                  {/* Plants */}
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{client.plants}</span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <SubscriptionBadge status={client.subscription} />
                  </td>
                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === client.id ? null : client.id)}
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
                              View
                            </button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
                              <CalendarCheck className="h-3.5 w-3.5" />
                              Schedule Visit
                            </button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
                              <Leaf className="h-3.5 w-3.5" />
                              View Plants
                            </button>
                            <div className="my-1 border-t border-gray-100 dark:border-white/5" />
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                              <XCircle className="h-3.5 w-3.5" />
                              Deactivate
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

        {/* Empty state */}
        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <UserX className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No clients found</p>
            <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
