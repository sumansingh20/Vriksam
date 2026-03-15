// =============================================================================
// VRIKSHAM - Technicians Service
// =============================================================================

import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  Technician,
  PaginationParams,
  ServiceVisit,
} from '@/types';
import { ServiceType } from '@/types';

// -----------------------------------------------------------------------------
// Filter & Payload Types
// -----------------------------------------------------------------------------

export interface TechnicianFilters extends PaginationParams {
  search?: string;
  specialization?: ServiceType;
  teamId?: string;
  isAvailable?: boolean;
}

export interface TechnicianSchedule {
  technicianId: string;
  date: string;
  visits: ServiceVisit[];
  totalDistance?: number;
  estimatedHours: number;
}

export interface TechnicianPerformanceMetrics {
  technicianId: string;
  period: string;
  totalVisits: number;
  completedVisits: number;
  averageRating: number;
  averageDuration: number;
  plantsSaved: number;
  clientSatisfaction: number;
  onTimePercentage: number;
}

const TECHNICIANS_PREFIX = '/technicians';

export const techniciansService = {
  /**
   * Get paginated list of technicians with optional filters.
   */
  async getAll(
    filters?: TechnicianFilters
  ): Promise<{ technicians: Technician[]; pagination: PaginationMeta }> {
    const response = await api.get<PaginatedResponse<Technician>>(
      TECHNICIANS_PREFIX,
      {
        params: {
          page: filters?.page,
          pageSize: filters?.pageSize,
          sortBy: filters?.sortBy,
          sortOrder: filters?.sortOrder,
          search: filters?.search,
          specialization: filters?.specialization,
          teamId: filters?.teamId,
          isAvailable: filters?.isAvailable,
        },
      }
    );
    return { technicians: response.data, pagination: response.pagination };
  },

  /**
   * Get a single technician by ID.
   */
  async getById(id: string): Promise<Technician> {
    const response = await api.get<ApiResponse<Technician>>(
      `${TECHNICIANS_PREFIX}/${id}`
    );
    return response.data;
  },

  /**
   * Create a new technician record.
   */
  async create(data: Partial<Technician>): Promise<Technician> {
    const response = await api.post<ApiResponse<Technician>>(
      TECHNICIANS_PREFIX,
      data
    );
    return response.data;
  },

  /**
   * Update an existing technician.
   */
  async update(id: string, data: Partial<Technician>): Promise<Technician> {
    const response = await api.patch<ApiResponse<Technician>>(
      `${TECHNICIANS_PREFIX}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Get the schedule for a technician over a date range.
   */
  async getSchedule(
    id: string,
    params?: { dateFrom?: string; dateTo?: string }
  ): Promise<TechnicianSchedule[]> {
    const response = await api.get<ApiResponse<TechnicianSchedule[]>>(
      `${TECHNICIANS_PREFIX}/${id}/schedule`,
      {
        params: {
          dateFrom: params?.dateFrom,
          dateTo: params?.dateTo,
        },
      }
    );
    return response.data;
  },

  /**
   * Get performance metrics for a technician over a given period.
   */
  async getPerformance(
    id: string,
    params?: { period?: 'week' | 'month' | 'quarter' | 'year' }
  ): Promise<TechnicianPerformanceMetrics> {
    const response = await api.get<ApiResponse<TechnicianPerformanceMetrics>>(
      `${TECHNICIANS_PREFIX}/${id}/performance`,
      {
        params: {
          period: params?.period,
        },
      }
    );
    return response.data;
  },
};

export default techniciansService;
