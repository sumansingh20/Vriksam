'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Building2,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type ClientType = 'corporate' | 'residential' | 'government' | 'hospitality';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled';

export interface ClientRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: ClientType;
  locations: number;
  plants: number;
  subscription: SubscriptionStatus;
}

interface ClientTableProps {
  clients?: ClientRecord[];
  pageSize?: number;
}

/* -------------------------------------------------------------------------- */
/*  Style config                                                              */
/* -------------------------------------------------------------------------- */

const TYPE_STYLES: Record<ClientType, { label: string; className: string }> = {
  corporate: { label: 'Corporate', className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' },
  residential: { label: 'Residential', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400' },
  government: { label: 'Government', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  hospitality: { label: 'Hospitality', className: 'bg-rose-500/10 text-rose-700 dark:text-rose-400' },
};

const SUB_STYLES: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  trial: { label: 'Trial', className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' },
  expired: { label: 'Expired', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ClientTable({ clients = [], pageSize = 8 }: ClientTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
    >
      {/* Search */}
      <div className="border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
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
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Locations</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Plants</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Subscription</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Contact</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80 dark:divide-white/5">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">No clients found</p>
                  <p className="mt-1 text-xs text-gray-500">Client records will appear from live organization data.</p>
                </td>
              </tr>
            )}
            {paginated.map((client) => {
              const typeBadge = TYPE_STYLES[client.type];
              const subBadge = SUB_STYLES[client.subscription];

              return (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-xs font-bold text-white">
                        {client.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Building2 className="h-3 w-3" />
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        typeBadge.className
                      )}
                    >
                      {typeBadge.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center text-gray-700 dark:text-gray-300">
                    {client.locations}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center text-gray-700 dark:text-gray-300">
                    {client.plants}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        subBadge.className
                      )}
                    >
                      {subBadge.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === client.id ? null : client.id)
                        }
                        aria-label={`Open actions for ${client.name}`}
                        title={`Open actions for ${client.name}`}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openDropdown === client.id && (
                        <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-xl border border-gray-200/80 bg-white p-1 shadow-elevated dark:border-white/10 dark:bg-gray-900">
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5">
                            <User className="h-3.5 w-3.5" />
                            View Profile
                          </button>
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5">
                            <Mail className="h-3.5 w-3.5" />
                            Send Email
                          </button>
                          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                            Deactivate
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200/60 px-5 py-3 dark:border-white/5">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {filtered.length === 0 ? 0 : page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of{' '}
          {filtered.length} clients
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            aria-label="Previous page"
            title="Previous page"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40 dark:hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                page === i
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
            title="Next page"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40 dark:hover:bg-white/5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ClientTable;
