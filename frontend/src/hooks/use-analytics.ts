// =============================================================================
// VRIKSHAM - Analytics Hooks
// =============================================================================
// React Query hooks for dashboard analytics data.
// =============================================================================

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import analyticsService, {
  type AnalyticsFilters,
  type OverviewStatsData,
  type PlantMetricsData,
  type RevenueMetricsData,
  type MaintenanceMetricsData,
  type ESGMetricsData,
  type TeamPerformanceData,
} from '@/services/analytics.service';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'overview', filters] as const,
  plantMetrics: (filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'plantMetrics', filters] as const,
  revenue: (filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'revenue', filters] as const,
  maintenance: (filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'maintenance', filters] as const,
  esg: (filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'esg', filters] as const,
  team: (filters?: AnalyticsFilters) =>
    [...analyticsKeys.all, 'team', filters] as const,
};

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

/**
 * Fetch high-level dashboard overview statistics.
 */
export function useOverviewStats(
  filters?: AnalyticsFilters,
  options?: Omit<UseQueryOptions<OverviewStatsData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: analyticsKeys.overview(filters),
    queryFn: () => analyticsService.getOverview(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    ...options,
  });
}

/**
 * Fetch plant health distribution, trends, and category breakdown.
 */
export function usePlantMetrics(
  filters?: AnalyticsFilters,
  options?: Omit<UseQueryOptions<PlantMetricsData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: analyticsKeys.plantMetrics(filters),
    queryFn: () => analyticsService.getPlantMetrics(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch revenue analytics including trends and plan breakdowns.
 */
export function useRevenueData(
  filters?: AnalyticsFilters,
  options?: Omit<UseQueryOptions<RevenueMetricsData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: analyticsKeys.revenue(filters),
    queryFn: () => analyticsService.getRevenue(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch maintenance visit metrics.
 */
export function useMaintenanceMetrics(
  filters?: AnalyticsFilters,
  options?: Omit<
    UseQueryOptions<MaintenanceMetricsData>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: analyticsKeys.maintenance(filters),
    queryFn: () => analyticsService.getMaintenanceMetrics(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch ESG sustainability metrics.
 */
export function useESGMetrics(
  filters?: AnalyticsFilters,
  options?: Omit<UseQueryOptions<ESGMetricsData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: analyticsKeys.esg(filters),
    queryFn: () => analyticsService.getESG(filters),
    staleTime: 10 * 60 * 1000, // ESG data doesn't change frequently
    ...options,
  });
}

/**
 * Fetch team/technician performance analytics.
 */
export function useTeamPerformance(
  filters?: AnalyticsFilters,
  options?: Omit<UseQueryOptions<TeamPerformanceData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: analyticsKeys.team(filters),
    queryFn: () => analyticsService.getTeamPerformance(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
