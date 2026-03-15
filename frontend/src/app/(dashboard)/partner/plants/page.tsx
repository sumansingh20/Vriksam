'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface PlantCard {
  id: string;
  plantId: string;
  name: string;
  species: string;
  location: string;
  healthScore: number;
  lastMaintenance: string;
  growthStage: 'Seedling' | 'Juvenile' | 'Mature' | 'Established';
  image?: string;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const plantStats = [
  { label: 'Total Plants', value: '1,847', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { label: 'Healthy', value: '1,684', icon: Heart, color: 'text-green-600', bg: 'bg-green-500/10' },
  { label: 'Needs Attention', value: 128, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  { label: 'Critical', value: 35, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
];

const locations = ['All Locations', 'Mumbai HQ', 'Bangalore Campus', 'Hyderabad Tower', 'Pune Office', 'Delhi Villas', 'Navi Mumbai'];
const healthFilters = ['All Health', 'Healthy', 'Needs Attention', 'Critical'];
const speciesFilters = ['All Species', 'Monstera', 'Peace Lily', 'Snake Plant', 'Fiddle Leaf Fig', 'Areca Palm', 'Pothos', 'ZZ Plant', 'Rubber Plant'];

const plants: PlantCard[] = [
  { id: '1', plantId: 'PLT-001', name: 'Monstera Deliciosa', species: 'Monstera', location: 'Mumbai HQ, Floor 3', healthScore: 95, lastMaintenance: 'Mar 12, 2026', growthStage: 'Mature' },
  { id: '2', plantId: 'PLT-002', name: 'Peace Lily', species: 'Spathiphyllum', location: 'Mumbai HQ, Lobby', healthScore: 88, lastMaintenance: 'Mar 11, 2026', growthStage: 'Established' },
  { id: '3', plantId: 'PLT-003', name: 'Fiddle Leaf Fig', species: 'Ficus lyrata', location: 'Bangalore Campus A', healthScore: 42, lastMaintenance: 'Mar 8, 2026', growthStage: 'Mature' },
  { id: '4', plantId: 'PLT-004', name: 'Snake Plant', species: 'Sansevieria', location: 'Hyderabad Tower, Reception', healthScore: 92, lastMaintenance: 'Mar 13, 2026', growthStage: 'Established' },
  { id: '5', plantId: 'PLT-005', name: 'Areca Palm', species: 'Dypsis lutescens', location: 'Pune Office Park', healthScore: 78, lastMaintenance: 'Mar 10, 2026', growthStage: 'Mature' },
  { id: '6', plantId: 'PLT-006', name: 'Pothos Golden', species: 'Epipremnum aureum', location: 'Delhi Green Villas', healthScore: 96, lastMaintenance: 'Mar 14, 2026', growthStage: 'Juvenile' },
  { id: '7', plantId: 'PLT-007', name: 'ZZ Plant', species: 'Zamioculcas', location: 'Mumbai HQ, Floor 5', healthScore: 85, lastMaintenance: 'Mar 9, 2026', growthStage: 'Mature' },
  { id: '8', plantId: 'PLT-008', name: 'Rubber Plant', species: 'Ficus elastica', location: 'Bangalore Campus B', healthScore: 25, lastMaintenance: 'Mar 5, 2026', growthStage: 'Established' },
  { id: '9', plantId: 'PLT-009', name: 'Bird of Paradise', species: 'Strelitzia', location: 'Pune Office Park', healthScore: 90, lastMaintenance: 'Mar 12, 2026', growthStage: 'Mature' },
  { id: '10', plantId: 'PLT-010', name: 'Calathea Orbifolia', species: 'Calathea', location: 'Hyderabad Tower, Lobby', healthScore: 55, lastMaintenance: 'Mar 7, 2026', growthStage: 'Juvenile' },
  { id: '11', plantId: 'PLT-011', name: 'Boston Fern', species: 'Nephrolepis', location: 'Navi Mumbai Office', healthScore: 82, lastMaintenance: 'Mar 11, 2026', growthStage: 'Mature' },
  { id: '12', plantId: 'PLT-012', name: 'Jade Plant', species: 'Crassula ovata', location: 'Delhi Green Villas', healthScore: 94, lastMaintenance: 'Mar 14, 2026', growthStage: 'Established' },
];

/* -------------------------------------------------------------------------- */
/*  Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function HealthIndicator({ score }: { score: number }) {
  const textColor =
    score >= 80 ? 'text-emerald-700 dark:text-emerald-400' : score >= 50 ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-100 dark:text-gray-700"
          />
          <circle
            cx="18" cy="18" r="15.5"
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
  const config: Record<string, { icon: React.ElementType; classes: string }> = {
    Seedling: { icon: Sprout, classes: 'bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400' },
    Juvenile: { icon: Leaf, classes: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' },
    Mature: { icon: TreePine, classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    Established: { icon: Flower2, classes: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400' },
  };
  const { icon: Icon, classes } = (config[stage] ?? config.Mature)!;

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', classes)}>
      <Icon className="h-3 w-3" />
      {stage}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PartnerPlantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [healthFilter, setHealthFilter] = useState('All Health');
  const [speciesFilter, setSpeciesFilter] = useState('All Species');

  const getHealthCategory = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 50) return 'Needs Attention';
    return 'Critical';
  };

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.plantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All Locations' || plant.location.includes(locationFilter);
    const matchesHealth = healthFilter === 'All Health' || getHealthCategory(plant.healthScore) === healthFilter;
    const matchesSpecies = speciesFilter === 'All Species' || plant.species.toLowerCase().includes(speciesFilter.toLowerCase());
    return matchesSearch && matchesLocation && matchesHealth && matchesSpecies;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plant Management"
        description="Monitor and manage all plants across your client locations."
        breadcrumbs={[
          { label: 'Partner', href: '/dashboard/partner' },
          { label: 'Plants' },
        ]}
      />

      {/* Stats Row */}
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

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by plant name, ID, or species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {healthFilters.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
          >
            {speciesFilters.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlants.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.04 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/5 dark:bg-gray-900/50"
          >
            {/* Plant image placeholder */}
            <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
              <div className="flex flex-col items-center">
                <Leaf className="h-10 w-10 text-emerald-300 dark:text-emerald-700" />
                <span className="mt-1 text-[10px] font-medium text-emerald-400 dark:text-emerald-600">{plant.species}</span>
              </div>
              {/* Health score top-right */}
              <div className="absolute right-3 top-3">
                <HealthIndicator score={plant.healthScore} />
              </div>
              {/* Plant ID */}
              <span className="absolute left-3 top-3 rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 backdrop-blur dark:bg-gray-900/80 dark:text-gray-400">
                {plant.plantId}
              </span>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="flex items-center gap-1.5 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur transition-transform hover:scale-105">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>

            {/* Content */}
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
                  Last: {plant.lastMaintenance}
                </div>
              </div>

              <div className="mt-3">
                <GrowthStageBadge stage={plant.growthStage} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPlants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Leaf className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No plants found</p>
          <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
