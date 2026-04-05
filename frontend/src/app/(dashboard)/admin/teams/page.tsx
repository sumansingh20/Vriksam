'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { useTeamPerformance } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';

const TEAM_BANDS = [
  'from-emerald-500 to-green-600',
  'from-sky-500 to-cyan-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-teal-500 to-emerald-600',
];

function TeamCard({
  team,
  index,
}: {
  team: {
    name: string;
    zone: string | null;
    memberCount: number;
    totalVisits: number;
    completionRate: number;
    averageRating: number;
    leadName: string | null;
  };
  index: number;
}) {
  const band = TEAM_BANDS[index % TEAM_BANDS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200/60 hover:shadow-glow-sm dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
    >
      <div className={cn('h-1.5 bg-gradient-to-r', band)} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {team.zone || 'Unassigned zone'}
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {team.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Members</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{team.memberCount}</p>
          </div>
          <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Visits</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{team.totalVisits}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-100/60 bg-emerald-50/70 p-3 dark:border-emerald-400/20 dark:bg-emerald-500/10">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            {team.completionRate.toFixed(1)}% completion rate
          </p>
          <p className="mt-1 text-xs text-emerald-600/90 dark:text-emerald-300/80">
            Lead: {team.leadName || 'Not assigned'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminTeamsPage() {
  const teamsQuery = useTeamPerformance();

  const summary = useMemo(() => {
    const teams = teamsQuery.data?.teams ?? [];
    const totalTeams = teams.length;
    const totalMembers = teams.reduce((sum, team) => sum + team.memberCount, 0);
    const avgCompletion =
      totalTeams > 0
        ? teams.reduce((sum, team) => sum + team.completionRate, 0) / totalTeams
        : 0;

    return {
      totalTeams,
      totalMembers,
      avgCompletion,
    };
  }, [teamsQuery.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        description="Live team performance across zones and service quality outcomes."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Teams' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => teamsQuery.refetch()}
            className="btn-emerald flex items-center gap-2 rounded-xl"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Teams
          </button>
        }
      />

      {teamsQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Team analytics is temporarily unavailable. Please try again in a moment.
        </div>
      )}

      {teamsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live team performance data...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/40">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total Teams</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{summary.totalTeams}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/40">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total Members</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{summary.totalMembers}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900/40">
          <p className="text-xs uppercase tracking-wide text-gray-400">Avg Completion</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{summary.avgCompletion.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(teamsQuery.data?.teams ?? []).map((team, index) => (
          <TeamCard key={`${team.name}-${index}`} team={team} index={index} />
        ))}
      </div>

      {!teamsQuery.isLoading && (teamsQuery.data?.teams.length ?? 0) === 0 && (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          No active teams found yet.
        </div>
      )}
    </div>
  );
}
