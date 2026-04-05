'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sprout,
  Droplets,
  MapPin,
  Heart,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { usePlants } from '@/hooks/use-plants';
import { cn } from '@/lib/utils';

type HealthStatus = 'healthy' | 'needs_attention' | 'critical';

interface MyPlant {
  id: string;
  name: string;
  species: string;
  location: string;
  healthStatus: HealthStatus;
  lastWatered: string;
}

const HEALTH_STYLES: Record<
  HealthStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  healthy: {
    label: 'Healthy',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
  },
  needs_attention: {
    label: 'Needs Attention',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-500',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-500/10',
    dot: 'bg-red-500',
  },
};

function toHealthStatus(score: number): HealthStatus {
  if (score >= 80) return 'healthy';
  if (score >= 50) return 'needs_attention';
  return 'critical';
}

function PlantCard({ plant, index }: { plant: MyPlant; index: number }) {
  const health = HEALTH_STYLES[plant.healthStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200/60 hover:shadow-glow-sm dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
    >
      <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-950/50 dark:to-green-950/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="h-16 w-16 text-emerald-300 dark:text-emerald-700" />
        </div>
        <div className="absolute right-3 top-3">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm', health.bg, health.color)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', health.dot)} />
            {health.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{plant.name}</h3>
        <p className="mt-0.5 text-xs italic text-gray-500">{plant.species}</p>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {plant.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Droplets className="h-3 w-3 text-sky-400" />
            Last watered:{' '}
            {plant.lastWatered
              ? new Date(plant.lastWatered).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })
              : '-'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ClientPlantsPage() {
  const plantsQuery = usePlants(
    {
      page: 1,
      pageSize: 300,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    {
      staleTime: 60 * 1000,
    },
  );

  const myPlants = useMemo<MyPlant[]>(
    () =>
      (plantsQuery.data?.plants ?? []).map((plant) => ({
        id: plant.id,
        name: plant.nickname || plant.species?.commonName || 'Unnamed Plant',
        species: plant.species?.commonName || 'Unknown Species',
        location: plant.location?.name || 'Unknown Location',
        healthStatus: toHealthStatus(Math.round(plant.healthScore || 0)),
        lastWatered: plant.lastWateredAt || plant.lastInspectedAt || plant.updatedAt,
      })),
    [plantsQuery.data?.plants],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Plants"
        description="Browse and monitor all plants across your locations."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'My Plants' },
        ]}
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Heart className="h-4 w-4 text-emerald-500" />
            <span>
              <strong className="text-gray-900 dark:text-white">{myPlants.length}</strong> total plants
            </span>
          </div>
        }
      />

      {plantsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live plants...
        </div>
      )}

      {plantsQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load your plants right now.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {myPlants.map((plant, index) => (
          <PlantCard key={plant.id} plant={plant} index={index} />
        ))}
      </div>

      {myPlants.length === 0 && !plantsQuery.isLoading && (
        <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
          No plants available yet for your account.
        </div>
      )}
    </div>
  );
}
