'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Search,
  Filter,
  TreePine,
  Heart,
  AlertTriangle,
  AlertCircle,
  MapPin,
  Calendar,
  Eye,
  Sprout,
  Flower2,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { usePlants } from '@/hooks/use-plants';
import { cn } from '@/lib/utils';

interface PlantCard {
  id: string;
  plantId: string;
  name: string;
  species: string;
  location: string;
  healthScore: number;
  lastMaintenance: string;
  growthStage: 'Seedling' | 'Juvenile' | 'Mature' | 'Established';
}

function normalizeGrowthStage(value?: string): PlantCard['growthStage'] {
  const stage = (value || '').toLowerCase();

  if (stage.includes('seed')) return 'Seedling';
  if (stage.includes('juvenile') || stage.includes('growing')) return 'Juvenile';
  if (stage.includes('establish')) return 'Established';
  return 'Mature';
}

function getHealthCategory(score: number): 'Healthy' | 'Needs Attention' | 'Critical' {
  if (score >= 80) return 'Healthy';
  if (score >= 50) return 'Needs Attention';
  return 'Critical';
}

function HealthIndicator({ score }: { score: number }) {
  const textColor =
    score >= 80
      ? 'text-emerald-700 dark:text-emerald-400'
      : score >= 50
        ? 'text-amber-700 dark:text-amber-400'
        : 'text-red-700 dark:text-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-100 dark:text-gray-700"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${(score / 100) * 97.5} 97.5`}
            strokeLinecap="round"
            className={score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'}
          />
        </svg>
        <span className={cn('absolute inset-0 flex items-center justify-center text-[9px] font-bold', textColor)}>
          {score}
        </span>
      </div>
    </div>
  );
}

function GrowthStageBadge({ stage }: { stage: string }) {
  type GrowthStageKey = 'Seedling' | 'Juvenile' | 'Mature' | 'Established';

  const config: Record<GrowthStageKey, { icon: React.ElementType; classes: string }> = {
    Seedling: { icon: Sprout, classes: 'bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400' },
    Juvenile: { icon: Leaf, classes: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' },
    Mature: { icon: TreePine, classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    Established: { icon: Flower2, classes: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400' },
  };

  const resolved = config[stage as GrowthStageKey] ?? config.Mature;
  const { icon: Icon, classes } = resolved;

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', classes)}>
      <Icon className="h-3 w-3" />
      {stage}
    </span>
  );
}

export default function PartnerPlantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [healthFilter, setHealthFilter] = useState('All Health');
  const [speciesFilter, setSpeciesFilter] = useState('All Species');

  const plantsQuery = usePlants(
    {
      page: 1,
      pageSize: 500,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    {
      staleTime: 60 * 1000,
    },
  );

  const plants = useMemo<PlantCard[]>(
    () =>
      (plantsQuery.data?.plants ?? []).map((plant) => ({
        id: plant.id,
        plantId: plant.plantCode || plant.id.slice(0, 8),
        name: plant.nickname || plant.species?.commonName || 'Unnamed Plant',
        species: plant.species?.commonName || 'Unknown Species',
        location: plant.location?.name || 'Unknown Location',
        healthScore: Math.max(0, Math.min(100, Math.round(plant.healthScore || 0))),
        lastMaintenance: plant.lastInspectedAt || plant.lastPrunedAt || plant.lastWateredAt || plant.updatedAt,
        growthStage: normalizeGrowthStage(String(plant.growthStage)),
      })),
    [plantsQuery.data?.plants],
  );

  const plantStats = useMemo(
    () => [
      {
        label: 'Total Plants',
        value: plants.length.toLocaleString('en-IN'),
        icon: Leaf,
        color: 'text-emerald-600',
        bg: 'bg-emerald-500/10',
      },
      {
        label: 'Healthy',
        value: plants.filter((plant) => getHealthCategory(plant.healthScore) === 'Healthy').length,
        icon: Heart,
        color: 'text-green-600',
        bg: 'bg-green-500/10',
      },
      {
        label: 'Needs Attention',
        value: plants.filter((plant) => getHealthCategory(plant.healthScore) === 'Needs Attention').length,
        icon: AlertTriangle,
        color: 'text-amber-600',
        bg: 'bg-amber-500/10',
      },
      {
        label: 'Critical',
        value: plants.filter((plant) => getHealthCategory(plant.healthScore) === 'Critical').length,
        icon: AlertCircle,
        color: 'text-red-600',
        bg: 'bg-red-500/10',
      },
    ],
    [plants],
  );

  const locations = useMemo(
    () => ['All Locations', ...new Set(plants.map((plant) => plant.location))],
    [plants],
  );

  const speciesFilters = useMemo(
    () => ['All Species', ...new Set(plants.map((plant) => plant.species))],
    [plants],
  );

  const filteredPlants = useMemo(
    () =>
      plants.filter((plant) => {
        const matchesSearch =
          plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plant.plantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plant.species.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = locationFilter === 'All Locations' || plant.location === locationFilter;
        const matchesHealth =
          healthFilter === 'All Health' || getHealthCategory(plant.healthScore) === healthFilter;
        const matchesSpecies = speciesFilter === 'All Species' || plant.species === speciesFilter;

        return matchesSearch && matchesLocation && matchesHealth && matchesSpecies;
      }),
    [healthFilter, locationFilter, plants, searchQuery, speciesFilter],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plant Management"
        description="Monitor and manage all plants across your client locations."
        breadcrumbs={[
          { label: 'Partner', href: '/partner' },
          { label: 'Plants' },
        ]}
      />

      {plantsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live plant inventory...
        </div>
      )}

      {plantsQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load plant inventory right now.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plantStats.map((stat, index) => {
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
            placeholder="Search by plant name, ID, or species..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            aria-label="Filter plants by location"
            title="Filter plants by location"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <select
            value={healthFilter}
            onChange={(event) => setHealthFilter(event.target.value)}
            aria-label="Filter plants by health status"
            title="Filter plants by health status"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {['All Health', 'Healthy', 'Needs Attention', 'Critical'].map((health) => (
              <option key={health} value={health}>
                {health}
              </option>
            ))}
          </select>
          <select
            value={speciesFilter}
            onChange={(event) => setSpeciesFilter(event.target.value)}
            aria-label="Filter plants by species"
            title="Filter plants by species"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {speciesFilters.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlants.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.04 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
              <div className="flex flex-col items-center">
                <Leaf className="h-10 w-10 text-emerald-300 dark:text-emerald-700" />
                <span className="mt-1 text-[10px] font-medium text-emerald-400 dark:text-emerald-600">
                  {plant.species}
                </span>
              </div>
              <div className="absolute right-3 top-3">
                <HealthIndicator score={plant.healthScore} />
              </div>
              <span className="absolute left-3 top-3 rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 backdrop-blur dark:bg-gray-900/80 dark:text-gray-400">
                {plant.plantId}
              </span>

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  className="flex items-center gap-1.5 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur transition-transform hover:scale-105"
                  title={`View details for ${plant.name}`}
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{plant.name}</h4>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{plant.species}</p>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{plant.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 shrink-0" />
                  Last: {plant.lastMaintenance ? new Date(plant.lastMaintenance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}
                </div>
              </div>

              <div className="mt-3">
                <GrowthStageBadge stage={plant.growthStage} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPlants.length === 0 && !plantsQuery.isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Leaf className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No plants found</p>
          <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
