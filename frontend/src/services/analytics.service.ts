// =============================================================================
// VRIKSHAM - Analytics Service
// =============================================================================

import api from './api';
import type {
  ApiResponse,
  DashboardStats,
  PlantAnalytics,
  RevenueMetrics,
  ESGMetrics,
  TeamPerformance,
} from '@/types';

const ANALYTICS_PREFIX = '/analytics';

// -----------------------------------------------------------------------------
// Shared Filters
// -----------------------------------------------------------------------------

export interface AnalyticsFilters {
  period?: 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
  locationId?: string;
  clientId?: string;
}

// -----------------------------------------------------------------------------
// Maintenance Metrics (frontend-specific aggregation)
// -----------------------------------------------------------------------------

export interface MaintenanceMetricsData {
  totalVisits: number;
  completionRate: number;
  avgDuration: number;
  onTimeRate: number;
  visitsByType: Array<{ type: string; count: number }>;
  visitsTrend: Array<{ date: string; value: number }>;
}

export const analyticsService = {
  /**
   * Get high-level dashboard overview statistics.
   */
  async getOverview(filters?: AnalyticsFilters): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>(
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
  async getPlantMetrics(filters?: AnalyticsFilters): Promise<PlantAnalytics> {
    const response = await api.get<ApiResponse<PlantAnalytics>>(
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
  async getRevenue(filters?: AnalyticsFilters): Promise<RevenueMetrics> {
    const response = await api.get<ApiResponse<RevenueMetrics>>(
      `${ANALYTICS_PREFIX}/revenue`,
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
  async getESG(filters?: AnalyticsFilters): Promise<ESGMetrics> {
    const response = await api.get<ApiResponse<ESGMetrics>>(
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
  ): Promise<TeamPerformance> {
    const response = await api.get<ApiResponse<TeamPerformance>>(
      `${ANALYTICS_PREFIX}/team`,
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
