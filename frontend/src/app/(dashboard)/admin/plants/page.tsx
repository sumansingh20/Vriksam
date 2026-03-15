'use client';

import { useState } from 'react';
import { Plus, Filter, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { PlantTable } from '@/components/dashboard/plant-table';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Filter options                                                            */
/* -------------------------------------------------------------------------- */

type FilterType = 'all' | 'healthy' | 'needs_attention' | 'critical' | 'replaced';

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'needs_attention', label: 'Needs Attention' },
  { key: 'critical', label: 'Critical' },
  { key: 'replaced', label: 'Replaced' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminPlantsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCount, _setSelectedCount] = useState(0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plants"
        description="Manage all plants across client locations."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Plants' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <button className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <Trash2 className="h-4 w-4" />
                Bulk Delete ({selectedCount})
              </button>
            )}
            <button className="btn-emerald flex items-center gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Add Plant
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Filter className="h-4 w-4" />
          <span>Status:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => setActiveFilter(option.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                activeFilter === option.key
                  ? 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <PlantTable />
    </div>
  );
}
