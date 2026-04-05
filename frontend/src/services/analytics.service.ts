// =============================================================================
// VRIKSHAM - Analytics Service
// =============================================================================

import api from './api';
import type { ApiResponse } from '@/types';

const ANALYTICS_PREFIX = '/analytics';

// -----------------------------------------------------------------------------
// Shared Filters
// -----------------------------------------------------------------------------

export interface AnalyticsFilters {
  period?: 'week' | 'month' | 'quarter' | 'year' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
  locationId?: string;
  clientId?: string;
}

export interface OverviewStatsData {
  totalClients: number;
  activeClients: number;
  totalPlants: number;
  healthyPlants: number;
  criticalPlants: number;
  totalTechnicians: number;
  activeTechnicians: number;
  pendingVisits: number;
  completedVisitsThisMonth: number;
  monthlyRevenue: number;
  pendingInvoices: number;
}

export interface PlantMetricsData {
  statusDistribution: Record<string, number>;
  speciesDistribution: Array<{ species: string; count: number }>;
  averageHealthScore: number;
  survivalRate: number;
  plantsByLocation: Array<{ location: string; count: number }>;
  recentHealthTrend: Array<{ date: string; avgScore: number }>;
}

export interface RevenueMetricsData {
  totalRevenue: number;
  periodRevenue: number;
  revenueGrowth: number;
  revenueTrend: Array<{ period: string; revenue: number }>;
  revenueByPlan: Array<{ plan: string; revenue: number }>;
  outstandingAmount: number;
  collectionRate: number;
}

// -----------------------------------------------------------------------------
// Maintenance Metrics (frontend-specific aggregation)
// -----------------------------------------------------------------------------

export interface MaintenanceMetricsData {
  totalVisitsThisMonth: number;
  completionRate: number;
  averageDuration: number;
  averageRating: number;
  visitsByType: Record<string, number>;
  visitsByStatus: Record<string, number>;
  topTechnicians: Array<{ name: string; visits: number; rating: number }>;
  missedVisitRate: number;
}

export interface ESGMetricsData {
  totalCO2Absorbed: number;
  totalO2Produced: number;
  averageAirPurifyingScore: number;
  greenScore: number;
  totalActivePlants: number;
  speciesWithHighAirPurifying: number;
  carbonOffsetEquivalent: number;
  environmentalImpactSummary: string;
}

export interface TeamPerformanceData {
  teams: Array<{
    name: string;
    zone: string | null;
    memberCount: number;
    totalVisits: number;
    completionRate: number;
    averageRating: number;
    leadName: string | null;
  }>;
}

export const analyticsService = {
  /**
   * Get high-level dashboard overview statistics.
   */
  async getOverview(filters?: AnalyticsFilters): Promise<OverviewStatsData> {
    const response = await api.get<ApiResponse<OverviewStatsData>>(
      `${ANALYTICS_PREFIX}/overview`,
      {
        params: {
          period: filters?.period,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          locationId: filters?.locationId,
          clientId: filters?.clientId,
        },
      }
    );
    return response.data;
  },

  /**
   * Get plant health distribution, trends, and category breakdowns.
   */
  async getPlantMetrics(filters?: AnalyticsFilters): Promise<PlantMetricsData> {
    const response = await api.get<ApiResponse<PlantMetricsData>>(
      `${ANALYTICS_PREFIX}/plants`,
      {
        params: {
          period: filters?.period,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          locationId: filters?.locationId,
          clientId: filters?.clientId,
        },
      }
    );
    return response.data;
  },

  /**
   * Get revenue analytics including trends and plan breakdowns.
   */
  async getRevenue(filters?: AnalyticsFilters): Promise<RevenueMetricsData> {
    const mappedPeriod =
      filters?.period === 'quarter'
        ? 'quarterly'
        : filters?.period === 'year'
          ? 'yearly'
          : filters?.period === 'quarterly' || filters?.period === 'yearly'
            ? filters.period
            : 'monthly';

    const response = await api.get<ApiResponse<RevenueMetricsData>>(
      `${ANALYTICS_PREFIX}/revenue`,
      {
        params: {
          period: mappedPeriod,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
        },
      }
    );
    return response.data;
  },

  /**
   * Get maintenance/service visit metrics.
   */
  async getMaintenanceMetrics(
    filters?: AnalyticsFilters
  ): Promise<MaintenanceMetricsData> {
    const response = await api.get<ApiResponse<MaintenanceMetricsData>>(
      `${ANALYTICS_PREFIX}/maintenance`,
      {
        params: {
          period: filters?.period,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          locationId: filters?.locationId,
        },
      }
    );
    return response.data;
  },

  /**
   * Get ESG (Environmental, Social, Governance) sustainability metrics.
   */
  async getESG(filters?: AnalyticsFilters): Promise<ESGMetricsData> {
    const response = await api.get<ApiResponse<ESGMetricsData>>(
      `${ANALYTICS_PREFIX}/esg`,
      {
        params: {
          period: filters?.period,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          locationId: filters?.locationId,
        },
      }
    );
    return response.data;
  },

  /**
   * Get team/technician performance analytics.
   */
  async getTeamPerformance(
    filters?: AnalyticsFilters
  ): Promise<TeamPerformanceData> {
    const response = await api.get<ApiResponse<TeamPerformanceData>>(
      `${ANALYTICS_PREFIX}/teams`,
      {
        params: {
          period: filters?.period,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
        },
      }
    );
    return response.data;
  },
};

export default analyticsService;
