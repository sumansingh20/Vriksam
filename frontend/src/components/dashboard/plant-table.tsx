'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sprout,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type PlantHealthStatus = 'healthy' | 'needs_attention' | 'critical' | 'replaced';
export type GrowthStage = 'seedling' | 'growing' | 'mature' | 'established';

export interface PlantRecord {
  id: string;
  name: string;
  species: string;
  location: string;
  healthStatus: PlantHealthStatus;
  lastMaintenance: string;
  growthStage: GrowthStage;
  imageUrl?: string;
}

interface PlantTableProps {
  plants?: PlantRecord[];
  pageSize?: number;
}

/* -------------------------------------------------------------------------- */
/*  Status / stage config                                                     */
/* -------------------------------------------------------------------------- */

const HEALTH_STYLES: Record<PlantHealthStatus, { label: string; className: string }> = {
  healthy: { label: 'Healthy', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  needs_attention: { label: 'Needs Attention', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  critical: { label: 'Critical', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
  replaced: { label: 'Replaced', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400' },
};

const STAGE_STYLES: Record<GrowthStage, { label: string; className: string }> = {
  seedling: { label: 'Seedling', className: 'text-sky-600 dark:text-sky-400' },
  growing: { label: 'Growing', className: 'text-emerald-600 dark:text-emerald-400' },
  mature: { label: 'Mature', className: 'text-green-700 dark:text-green-400' },
  established: { label: 'Established', className: 'text-forest-700 dark:text-forest-400' },
};

/* -------------------------------------------------------------------------- */
/*  Default mock data                                                         */
/* -------------------------------------------------------------------------- */

const DEFAULT_PLANTS: PlantRecord[] = [
  { id: 'PLT-001', name: 'Peace Lily', species: 'Spathiphyllum', location: 'Mumbai HQ - Lobby', healthStatus: 'healthy', lastMaintenance: '2026-03-12', growthStage: 'mature' },
  { id: 'PLT-002', name: 'Snake Plant', species: 'Dracaena trifasciata', location: 'Mumbai HQ - Floor 3', healthStatus: 'healthy', lastMaintenance: '2026-03-10', growthStage: 'established' },
  { id: 'PLT-003', name: 'Fiddle Leaf Fig', species: 'Ficus lyrata', location: 'Bangalore Office', healthStatus: 'needs_attention', lastMaintenance: '2026-03-08', growthStage: 'growing' },
  { id: 'PLT-004', name: 'Monstera', species: 'Monstera deliciosa', location: 'Delhi Campus', healthStatus: 'healthy', lastMaintenance: '2026-03-11', growthStage: 'mature' },
  { id: 'PLT-005', name: 'Boston Fern', species: 'Nephrolepis exaltata', location: 'Hyderabad Tower', healthStatus: 'critical', lastMaintenance: '2026-03-05', growthStage: 'mature' },
  { id: 'PLT-006', name: 'Rubber Plant', species: 'Ficus elastica', location: 'Pune SEZ', healthStatus: 'healthy', lastMaintenance: '2026-03-13', growthStage: 'established' },
  { id: 'PLT-007', name: 'ZZ Plant', species: 'Zamioculcas zamiifolia', location: 'Chennai Office', healthStatus: 'healthy', lastMaintenance: '2026-03-09', growthStage: 'growing' },
  { id: 'PLT-008', name: 'Pothos', species: 'Epipremnum aureum', location: 'Mumbai HQ - Floor 5', healthStatus: 'replaced', lastMaintenance: '2026-03-01', growthStage: 'seedling' },
  { id: 'PLT-009', name: 'Areca Palm', species: 'Dypsis lutescens', location: 'Kolkata Mall', healthStatus: 'needs_attention', lastMaintenance: '2026-03-07', growthStage: 'mature' },
  { id: 'PLT-010', name: 'Spider Plant', species: 'Chlorophytum comosum', location: 'Bangalore Office', healthStatus: 'healthy', lastMaintenance: '2026-03-14', growthStage: 'established' },
  { id: 'PLT-011', name: 'Calathea', species: 'Calathea orbifolia', location: 'Delhi Campus', healthStatus: 'needs_attention', lastMaintenance: '2026-03-06', growthStage: 'growing' },
  { id: 'PLT-012', name: 'Bamboo Palm', species: 'Chamaedorea seifrizii', location: 'Hyderabad Tower', healthStatus: 'healthy', lastMaintenance: '2026-03-13', growthStage: 'mature' },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

type SortField = 'id' | 'name' | 'species' | 'location' | 'healthStatus' | 'lastMaintenance' | 'growthStage';

export function PlantTable({ plants = DEFAULT_PLANTS, pageSize = 8 }: PlantTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return plants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [plants, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      const aVal = a[sortField];
      const bVal = b[sortField];
      return aVal < bVal ? -1 * dir : aVal > bVal ? 1 * dir : 0;
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

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
            placeholder="Search plants..."
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
              {([
                { field: 'id' as const, label: 'ID' },
                { field: 'name' as const, label: 'Name' },
                { field: 'species' as const, label: 'Species' },
                { field: 'location' as const, label: 'Location' },
                { field: 'healthStatus' as const, label: 'Health' },
                { field: 'lastMaintenance' as const, label: 'Last Maintenance' },
                { field: 'growthStage' as const, label: 'Growth Stage' },
              ]).map(({ field, label }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="cursor-pointer whitespace-nowrap px-5 py-3 text-left text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80 dark:divide-white/5">
            {paginated.map((plant) => {
              const health = HEALTH_STYLES[plant.healthStatus];
              const stage = STAGE_STYLES[plant.growthStage];

              return (
                <tr
                  key={plant.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                    {plant.id}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Sprout className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {plant.name}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 italic dark:text-gray-400">
                    {plant.species}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400">
                    {plant.location}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        health.className
                      )}
                    >
                      {health.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(plant.lastMaintenance).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className={cn('text-xs font-medium', stage.className)}>
                      {stage.label}
                    </span>
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
          Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sorted.length)} of{' '}
          {sorted.length} plants
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
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
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40 dark:hover:bg-white/5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default PlantTable;
