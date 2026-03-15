'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface InventoryItem {
  id: string;
  species: string;
  commonName: string;
  quantity: number;
  minStock: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const inventory: InventoryItem[] = [
  { id: 'INV-001', species: 'Spathiphyllum', commonName: 'Peace Lily', quantity: 45, minStock: 20, costPerUnit: 350, supplier: 'Green Nurseries Pvt Ltd', lastRestocked: '2026-03-10' },
  { id: 'INV-002', species: 'Dracaena trifasciata', commonName: 'Snake Plant', quantity: 62, minStock: 30, costPerUnit: 250, supplier: 'Flora India', lastRestocked: '2026-03-08' },
  { id: 'INV-003', species: 'Ficus lyrata', commonName: 'Fiddle Leaf Fig', quantity: 12, minStock: 15, costPerUnit: 1200, supplier: 'Premium Greens', lastRestocked: '2026-02-28' },
  { id: 'INV-004', species: 'Monstera deliciosa', commonName: 'Monstera', quantity: 38, minStock: 25, costPerUnit: 800, supplier: 'Green Nurseries Pvt Ltd', lastRestocked: '2026-03-05' },
  { id: 'INV-005', species: 'Nephrolepis exaltata', commonName: 'Boston Fern', quantity: 8, minStock: 20, costPerUnit: 200, supplier: 'Flora India', lastRestocked: '2026-02-20' },
  { id: 'INV-006', species: 'Ficus elastica', commonName: 'Rubber Plant', quantity: 55, minStock: 20, costPerUnit: 450, supplier: 'Premium Greens', lastRestocked: '2026-03-12' },
  { id: 'INV-007', species: 'Zamioculcas zamiifolia', commonName: 'ZZ Plant', quantity: 30, minStock: 15, costPerUnit: 550, supplier: 'Green Nurseries Pvt Ltd', lastRestocked: '2026-03-07' },
  { id: 'INV-008', species: 'Epipremnum aureum', commonName: 'Pothos', quantity: 85, minStock: 40, costPerUnit: 150, supplier: 'Flora India', lastRestocked: '2026-03-14' },
  { id: 'INV-009', species: 'Dypsis lutescens', commonName: 'Areca Palm', quantity: 18, minStock: 10, costPerUnit: 1500, supplier: 'Premium Greens', lastRestocked: '2026-03-01' },
  { id: 'INV-010', species: 'Chlorophytum comosum', commonName: 'Spider Plant', quantity: 70, minStock: 30, costPerUnit: 180, supplier: 'Flora India', lastRestocked: '2026-03-11' },
];

/* -------------------------------------------------------------------------- */
/*  Stock Level Bar                                                           */
/* -------------------------------------------------------------------------- */

function StockLevelBar({ quantity, minStock }: { quantity: number; minStock: number }) {
  const maxDisplay = minStock * 3;
  const percentage = Math.min((quantity / maxDisplay) * 100, 100);
  const isLow = quantity < minStock;
  const isCritical = quantity < minStock * 0.5;

  const color = isCritical
    ? 'bg-red-500'
    : isLow
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
      <span className={cn(
        'text-xs font-medium',
        isCritical ? 'text-red-600 dark:text-red-400' : isLow ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'
      )}>
        {quantity}/{minStock}
      </span>
      {isLow && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminInventoryPage() {
  const [search, setSearch] = useState('');

  const filtered = inventory.filter(
    (item) =>
      item.commonName.toLowerCase().includes(search.toLowerCase()) ||
      item.species.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track plant species stock levels, costs, and suppliers."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Inventory' },
        ]}
        actions={
          <button className="btn-emerald flex items-center gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Species
          </button>
        }
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
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100/80 dark:border-white/5">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Species</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Stock Level</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Cost/Unit</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Supplier</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Last Restocked</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80 dark:divide-white/5">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Package className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.commonName}</p>
                        <p className="text-xs italic text-gray-500">{item.species}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-semibold text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <StockLevelBar quantity={item.quantity} minStock={item.minStock} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400">
                    ₹{item.costPerUnit.toLocaleString('en-IN')}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400">
                    {item.supplier}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(item.lastRestocked).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <button
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        item.quantity < item.minStock
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5'
                      )}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
