'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  RefreshCw,
  Leaf,
  Thermometer,
  Droplets,
  Sun,
  Send,
  ChevronRight,
  Clock,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  pagination?: {
    total?: number;
  };
}

interface PlantRow {
  id: string;
  nickname?: string | null;
  status?: string;
  lastMaintenance?: string | null;
  species?: {
    commonName?: string;
  };
  location?: {
    name?: string;
    client?: {
      companyName?: string;
    };
  };
}

interface HealthLogRow {
  id: string;
  healthScore: number;
  notes?: string | null;
  temperature?: number | null;
  humidity?: number | null;
  soilMoisture?: number | null;
  lightLevel?: number | null;
  createdAt: string;
}

interface AssessmentForm {
  healthScore: number;
  notes: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
  lightLevel: string;
}

type PlantStatusKey = 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL' | 'REMOVED';

const STATUS_STYLES: Record<PlantStatusKey, { label: string; className: string; color: string }> = {
  HEALTHY: {
    label: 'Healthy',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    color: 'text-emerald-500',
  },
  NEEDS_ATTENTION: {
    label: 'Needs Attention',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    color: 'text-amber-500',
  },
  CRITICAL: {
    label: 'Critical',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400',
    color: 'text-red-500',
  },
  REMOVED: {
    label: 'Removed',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    color: 'text-gray-500',
  },
};

function scoreStyle(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-green-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getStatusStyle(status?: string) {
  return STATUS_STYLES[status as PlantStatusKey] ?? STATUS_STYLES.HEALTHY;
}

function ReadingsChart({ readings }: { readings: Array<{ date: string; score: number }> }) {
  if (readings.length === 0) {
    return <p className="text-xs text-gray-500">No health readings available yet.</p>;
  }

  return (
    <div className="flex h-32 items-end gap-3">
      {readings.map((reading) => {
        const safeScore = Math.max(0, Math.min(100, reading.score));
        const bars = Math.max(1, Math.round(safeScore / 10));

        return (
          <div key={reading.date} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">{safeScore}</span>
            <div className="flex h-24 w-full flex-col justify-end gap-0.5">
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={`${reading.date}-${index}`}
                  className={cn(
                    'h-2 w-full rounded-sm',
                    index < bars ? scoreStyle(safeScore) : 'bg-gray-200 dark:bg-gray-700',
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">{reading.date}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function TechnicianPlantHealthPage() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const [form, setForm] = useState<AssessmentForm>({
    healthScore: 80,
    notes: '',
    temperature: '',
    humidity: '',
    soilMoisture: '',
    lightLevel: '',
  });

  const plantsQuery = useQuery({
    queryKey: ['technician', 'plant-health', 'plants'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<PlantRow[]>>('/plants', {
        params: {
          page: 1,
          limit: 200,
          sortBy: 'updatedAt',
          sortOrder: 'desc',
        },
      });

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!selectedPlantId && (plantsQuery.data ?? []).length > 0) {
      setSelectedPlantId(plantsQuery.data?.[0]?.id || null);
    }
  }, [plantsQuery.data, selectedPlantId]);

  const selectedPlant = useMemo(
    () => (plantsQuery.data ?? []).find((plant) => plant.id === selectedPlantId) ?? null,
    [plantsQuery.data, selectedPlantId],
  );

  const healthLogsQuery = useQuery({
    queryKey: ['technician', 'plant-health', 'logs', selectedPlantId],
    queryFn: async () => {
      if (!selectedPlantId) return [] as HealthLogRow[];

      const response = await api.get<ApiEnvelope<HealthLogRow[]>>(
        `/plants/${selectedPlantId}/health-logs`,
        {
          params: { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
        },
      );

      return response.data ?? [];
    },
    enabled: Boolean(selectedPlantId),
    staleTime: 60 * 1000,
  });

  const submitAssessmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPlantId) return;

      await api.post(`/plants/${selectedPlantId}/health-check`, {
        healthScore: form.healthScore,
        notes: form.notes.trim() || undefined,
        temperature: form.temperature ? Number(form.temperature) : undefined,
        humidity: form.humidity ? Number(form.humidity) : undefined,
        soilMoisture: form.soilMoisture ? Number(form.soilMoisture) : undefined,
        lightLevel: form.lightLevel ? Number(form.lightLevel) : undefined,
      });
    },
    onSuccess: async () => {
      setForm({
        healthScore: Math.max(20, Math.min(100, form.healthScore)),
        notes: '',
        temperature: '',
        humidity: '',
        soilMoisture: '',
        lightLevel: '',
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['technician', 'plant-health', 'logs', selectedPlantId] }),
        queryClient.invalidateQueries({ queryKey: ['technician', 'plant-health', 'plants'] }),
      ]);
    },
  });

  const filteredPlants = useMemo(() => {
    const plants = plantsQuery.data ?? [];
    if (!searchQuery.trim()) return plants;

    const query = searchQuery.toLowerCase();
    return plants.filter((plant) => {
      const name = String(plant.nickname || plant.species?.commonName || '').toLowerCase();
      const id = String(plant.id).toLowerCase();
      return name.includes(query) || id.includes(query);
    });
  }, [plantsQuery.data, searchQuery]);

  const latestLog = healthLogsQuery.data?.[0];
  const chartReadings = useMemo(() => {
    return (healthLogsQuery.data ?? [])
      .slice(0, 5)
      .reverse()
      .map((log) => ({
        date: new Date(log.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        }),
        score: Number(log.healthScore ?? 0),
      }));
  }, [healthLogsQuery.data]);

  const statusConfig = getStatusStyle(selectedPlant?.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plant Health"
        description="Assess and monitor live plant health records from production data."
        breadcrumbs={[
          { label: 'Technician', href: '/technician' },
          { label: 'Plant Health' },
        ]}
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by plant name or ID"
            className="w-full rounded-xl border border-gray-200/60 bg-white/80 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900/50 dark:text-white"
          />
        </div>
        <button
          type="button"
          title="Refresh live plant health data"
          aria-label="Refresh live plant health data"
          onClick={() => plantsQuery.refetch()}
          className="flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white/80 px-4 py-3 text-sm font-medium text-gray-700 backdrop-blur-xl transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className="border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Live Plant Inventory</h3>
            </div>

            {plantsQuery.isLoading ? (
              <div className="flex items-center gap-2 px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading plants...
              </div>
            ) : plantsQuery.isError ? (
              <div className="flex items-center gap-2 px-5 py-4 text-sm text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                Unable to load plant records.
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {filteredPlants.map((plant) => {
                  const isSelected = selectedPlant?.id === plant.id;
                  const rowStatus = getStatusStyle(plant.status);
                  const plantName = plant.nickname || plant.species?.commonName || 'Unnamed plant';
                  const location = plant.location?.name || 'Unknown location';

                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => setSelectedPlantId(plant.id)}
                      className={cn(
                        'flex w-full items-center gap-3 p-4 text-left transition-colors',
                        isSelected
                          ? 'bg-emerald-50/50 dark:bg-emerald-500/5'
                          : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.02]',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {plantName}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">{plant.id} - {location}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', rowStatus.className)}>
                            {rowStatus.label}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock className="h-2.5 w-2.5" />
                            {plant.lastMaintenance
                              ? new Date(plant.lastMaintenance).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                })
                              : 'No logs yet'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                    </button>
                  );
                })}

                {filteredPlants.length === 0 && (
                  <div className="py-8 text-center text-sm text-gray-400">No plants found.</div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedPlant ? (
              <motion.div
                key={selectedPlant.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedPlant.nickname || selectedPlant.species?.commonName || 'Unnamed plant'}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedPlant.id} - {selectedPlant.location?.name || 'Unknown location'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                        <span className={cn('text-sm font-bold', statusConfig.color)}>{statusConfig.label}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">Current Status</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      {
                        icon: Thermometer,
                        label: 'Temperature',
                        value: latestLog?.temperature != null ? `${latestLog.temperature} C` : 'N/A',
                        color: 'text-orange-500',
                      },
                      {
                        icon: Droplets,
                        label: 'Humidity',
                        value: latestLog?.humidity != null ? `${latestLog.humidity}%` : 'N/A',
                        color: 'text-sky-500',
                      },
                      {
                        icon: Sun,
                        label: 'Light Level',
                        value: latestLog?.lightLevel != null ? `${latestLog.lightLevel}` : 'N/A',
                        color: 'text-amber-500',
                      },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-xl bg-gray-50/80 p-3 text-center dark:bg-white/[0.03]">
                        <metric.icon className={cn('mx-auto h-4 w-4', metric.color)} />
                        <p className="mt-1 text-xs font-bold text-gray-900 dark:text-white">{metric.value}</p>
                        <p className="text-[10px] text-gray-400">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
                  <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Recent Health Scores</h4>
                  {healthLogsQuery.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading health logs...
                    </div>
                  ) : (
                    <ReadingsChart readings={chartReadings} />
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
                  <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Submit Health Assessment</h4>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="health-score" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        Health Score ({form.healthScore})
                      </label>
                      <input
                        id="health-score"
                        type="range"
                        min={0}
                        max={100}
                        value={form.healthScore}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, healthScore: Number(event.target.value) }))
                        }
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="temp" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                          Temperature (C)
                        </label>
                        <input
                          id="temp"
                          type="number"
                          value={form.temperature}
                          onChange={(event) => setForm((prev) => ({ ...prev, temperature: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="humidity" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                          Humidity (%)
                        </label>
                        <input
                          id="humidity"
                          type="number"
                          value={form.humidity}
                          onChange={(event) => setForm((prev) => ({ ...prev, humidity: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="soil" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                          Soil Moisture
                        </label>
                        <input
                          id="soil"
                          type="number"
                          value={form.soilMoisture}
                          onChange={(event) => setForm((prev) => ({ ...prev, soilMoisture: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="light" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                          Light Level
                        </label>
                        <input
                          id="light"
                          type="number"
                          value={form.lightLevel}
                          onChange={(event) => setForm((prev) => ({ ...prev, lightLevel: event.target.value }))}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="assessment-notes" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        Assessment Notes
                      </label>
                      <textarea
                        id="assessment-notes"
                        value={form.notes}
                        onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                        placeholder="Add observations from this visit"
                        rows={3}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      {submitAssessmentMutation.isError ? (
                        <p className="text-xs text-red-600">
                          {(submitAssessmentMutation.error as Error)?.message ||
                            'Unable to submit assessment.'}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Assessment saves directly to the plant health log.</p>
                      )}

                      <button
                        type="button"
                        onClick={() => submitAssessmentMutation.mutate()}
                        disabled={submitAssessmentMutation.isPending}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {submitAssessmentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Submit Assessment
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-64 items-center justify-center rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
              >
                <div className="text-center">
                  <Leaf className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
                  <p className="mt-3 text-sm text-gray-400">Select a plant to view live details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
