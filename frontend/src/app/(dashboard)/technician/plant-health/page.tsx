'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  QrCode,
  Leaf,
  Thermometer,
  Droplets,
  Sun,
  Bug,
  RefreshCw,
  Flag,
  Camera,
  Send,
  ChevronRight,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type HealthStatus = 'excellent' | 'good' | 'fair' | 'critical';

interface PlantAssessment {
  id: string;
  plantName: string;
  plantId: string;
  location: string;
  score: number;
  status: HealthStatus;
  date: string;
  trend: 'up' | 'down' | 'stable';
}

interface PlantReading {
  date: string;
  score: number;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const recentAssessments: PlantAssessment[] = [
  { id: 'A-001', plantName: 'Monstera Deliciosa', plantId: 'PLT-1042', location: 'TechCorp HQ, Floor 3', score: 92, status: 'excellent', date: '2026-03-15', trend: 'up' },
  { id: 'A-002', plantName: 'Fiddle Leaf Fig', plantId: 'PLT-1038', location: 'GreenSpace Office', score: 78, status: 'good', date: '2026-03-15', trend: 'stable' },
  { id: 'A-003', plantName: 'Peace Lily', plantId: 'PLT-1055', location: 'Regal Hotel Lobby', score: 45, status: 'fair', date: '2026-03-14', trend: 'down' },
  { id: 'A-004', plantName: 'Boston Fern', plantId: 'PLT-1021', location: 'InfoSys Atrium', score: 88, status: 'excellent', date: '2026-03-14', trend: 'up' },
  { id: 'A-005', plantName: 'Calathea Orbifolia', plantId: 'PLT-1067', location: 'Hyderabad Tower', score: 28, status: 'critical', date: '2026-03-13', trend: 'down' },
];

const plantReadings: PlantReading[] = [
  { date: 'Mar 11', score: 82 },
  { date: 'Mar 12', score: 85 },
  { date: 'Mar 13', score: 88 },
  { date: 'Mar 14', score: 90 },
  { date: 'Mar 15', score: 92 },
];

const STATUS_STYLES: Record<HealthStatus, { label: string; className: string; color: string }> = {
  excellent: { label: 'Excellent', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', color: 'text-emerald-500' },
  good: { label: 'Good', className: 'bg-green-500/10 text-green-700 dark:text-green-400', color: 'text-green-500' },
  fair: { label: 'Fair', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', color: 'text-amber-500' },
  critical: { label: 'Critical', className: 'bg-red-500/10 text-red-700 dark:text-red-400', color: 'text-red-500' },
};

/* -------------------------------------------------------------------------- */
/*  Simple Bar Chart                                                           */
/* -------------------------------------------------------------------------- */

function ReadingsChart({ readings }: { readings: PlantReading[] }) {
  const maxScore = 100;

  return (
    <div className="flex items-end gap-3 h-32">
      {readings.map((reading, i) => {
        const height = (reading.score / maxScore) * 100;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">{reading.score}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                'w-full rounded-t-lg',
                reading.score >= 80 ? 'bg-emerald-500' : reading.score >= 60 ? 'bg-green-500' : reading.score >= 40 ? 'bg-amber-500' : 'bg-red-500',
              )}
            />
            <span className="text-[10px] text-gray-400">{reading.date}</span>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function TechnicianPlantHealthPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<PlantAssessment | null>(recentAssessments[0] ?? null);
  const [notes, setNotes] = useState('');

  const filteredAssessments = searchQuery
    ? recentAssessments.filter(
        (a) =>
          a.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.plantId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : recentAssessments;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plant Health"
        description="Assess and monitor plant health across all locations."
        breadcrumbs={[
          { label: 'Technician', href: '/technician' },
          { label: 'Plant Health' },
        ]}
      />

      {/* Search / Scan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by plant name or ID..."
            className="w-full rounded-xl border border-gray-200/60 bg-white/80 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-xl focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900/50 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white/80 px-4 py-3 text-sm font-medium text-gray-700 backdrop-blur-xl transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-900/50 dark:text-gray-300">
          <QrCode className="h-4 w-4" />
          Scan
        </button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Recent Assessments */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className="border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Assessments
              </h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredAssessments.map((assessment) => {
                const status = STATUS_STYLES[assessment.status];
                const isSelected = selectedPlant?.id === assessment.id;

                return (
                  <button
                    key={assessment.id}
                    onClick={() => setSelectedPlant(assessment)}
                    className={cn(
                      'flex w-full items-center gap-3 p-4 text-left transition-colors',
                      isSelected
                        ? 'bg-emerald-50/50 dark:bg-emerald-500/5'
                        : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.02]',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {assessment.plantName}
                        </p>
                        {assessment.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                        {assessment.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{assessment.plantId} - {assessment.location}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', status.className)}>
                          {status.label}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(assessment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-xl font-bold', status.color)}>
                        {assessment.score}
                      </p>
                      <p className="text-[10px] text-gray-400">score</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                  </button>
                );
              })}
              {filteredAssessments.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400">No plants found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: Selected Plant Detail */}
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
                {/* Health Score Display */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedPlant.plantName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{selectedPlant.plantId} - {selectedPlant.location}</p>
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        'flex h-20 w-20 items-center justify-center rounded-2xl',
                        selectedPlant.score >= 80 ? 'bg-emerald-500/10' :
                        selectedPlant.score >= 60 ? 'bg-green-500/10' :
                        selectedPlant.score >= 40 ? 'bg-amber-500/10' : 'bg-red-500/10',
                      )}>
                        <span className={cn(
                          'text-3xl font-bold',
                          STATUS_STYLES[selectedPlant.status].color,
                        )}>
                          {selectedPlant.score}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">Health Score</p>
                    </div>
                  </div>

                  {/* Environment Metrics */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { icon: Thermometer, label: 'Temperature', value: '24°C', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                      { icon: Droplets, label: 'Humidity', value: '65%', color: 'text-sky-500', bg: 'bg-sky-500/10' },
                      { icon: Sun, label: 'Light Level', value: 'Medium', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-xl bg-gray-50/80 p-3 text-center dark:bg-white/[0.03]">
                        <metric.icon className={cn('mx-auto h-4 w-4', metric.color)} />
                        <p className="mt-1 text-xs font-bold text-gray-900 dark:text-white">{metric.value}</p>
                        <p className="text-[10px] text-gray-400">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last 5 Readings Chart */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
                  <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Last 5 Readings
                  </h4>
                  <ReadingsChart readings={plantReadings} />
                </div>

                {/* Notes & Photo Upload */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
                  <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Assessment Notes
                  </h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your observations about the plant's condition..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                  />

                  {/* Photo Upload Area */}
                  <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center dark:border-white/10 dark:bg-white/[0.02]">
                    <Camera className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload photos or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </div>

                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
                    <Send className="h-4 w-4" />
                    Submit Assessment
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Bug, label: 'Report Disease', color: 'text-red-600', bg: 'bg-red-500/10', hover: 'hover:bg-red-500/15' },
                    { icon: RefreshCw, label: 'Request Replacement', color: 'text-amber-600', bg: 'bg-amber-500/10', hover: 'hover:bg-amber-500/15' },
                    { icon: Flag, label: 'Flag for Review', color: 'text-violet-600', bg: 'bg-violet-500/10', hover: 'hover:bg-violet-500/15' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border border-gray-200/60 p-4 transition-all dark:border-white/5',
                        action.hover,
                      )}
                    >
                      <div className={cn('rounded-lg p-2', action.bg)}>
                        <action.icon className={cn('h-4 w-4', action.color)} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  ))}
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
                  <p className="mt-3 text-sm text-gray-400">Select a plant to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
