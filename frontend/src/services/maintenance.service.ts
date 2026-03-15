// =============================================================================
// VRIKSHAM - Maintenance (Service Visits) Service
// =============================================================================

import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  ServiceVisit,
  ServiceVisitFilters,
} from '@/types';

// -----------------------------------------------------------------------------
// Payload Types
// -----------------------------------------------------------------------------

export interface CreateServiceVisitPayload {
  clientId: string;
  locationId: string;
  technicianId: string;
  teamId?: string;
  serviceType: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledDate: string;
  scheduledTimeStart: string;
  scheduledTimeEnd: string;
  notes?: string;
}

export interface UpdateServiceVisitPayload {
  technicianId?: string;
  serviceType?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduledDate?: string;
  scheduledTimeStart?: string;
  scheduledTimeEnd?: string;
  status?: string;
  notes?: string;
}

export interface CompleteServiceVisitPayload {
  duration: number;
  plantHealthLogs: Array<{
    plantId: string;
    healthScore: number;
    healthStatus: string;
    observations: string;
    recommendations: string;
    issues?: Array<{
      type: string;
      description: string;
      severity: 'mild' | 'moderate' | 'severe';
      affectedParts: string[];
    }>;
    treatmentsApplied?: Array<{
      type: string;
      product?: string;
      dosage?: string;
      description: string;
      followUpRequired: boolean;
    }>;
  }>;
  tasksCompleted?: Array<{
    description: string;
    isCompleted: boolean;
    notes?: string;
  }>;
  materialsUsed?: Array<{
    inventoryItemId: string;
    itemName: string;
    quantity: number;
    unit: string;
    cost: number;
  }>;
  photos?: string[];
  notes?: string;
  internalNotes?: string;
}

export interface ServiceScheduleDay {
  date: string;
  visits: ServiceVisit[];
  totalVisits: number;
  completedCount: number;
}

const MAINTENANCE_PREFIX = '/service-visits';

export const maintenanceService = {
  /**
   * Get paginated list of service visits with optional filters.
   */
  async getAll(
    filters?: ServiceVisitFilters
  ): Promise<{ visits: ServiceVisit[]; pagination: PaginationMeta }> {
    const response = await api.get<PaginatedResponse<ServiceVisit>>(
      MAINTENANCE_PREFIX,
      {
        params: {
          page: filters?.page,
          pageSize: filters?.pageSize,
          sortBy: filters?.sortBy,
          sortOrder: filters?.sortOrder,
          clientId: filters?.clientId,
          locationId: filters?.locationId,
          technicianId: filters?.technicianId,
          teamId: filters?.teamId,
          status: filters?.status,
          serviceType: filters?.serviceType,
          scheduledDateFrom: filters?.scheduledDateFrom,
          scheduledDateTo: filters?.scheduledDateTo,
          priority: filters?.priority,
        },
      }
    );
    return { visits: response.data, pagination: response.pagination };
  },

  /**
   * Get a single service visit by ID.
   */
  async getById(id: string): Promise<ServiceVisit> {
    const response = await api.get<ApiResponse<ServiceVisit>>(
      `${MAINTENANCE_PREFIX}/${id}`
    );
    return response.data;
  },

  /**
   * Create a new service visit.
   */
  async create(data: CreateServiceVisitPayload): Promise<ServiceVisit> {
    const response = await api.post<ApiResponse<ServiceVisit>>(
      MAINTENANCE_PREFIX,
      data
    );
    return response.data;
  },

  /**
   * Update an existing service visit.
   */
  async update(
    id: string,
    data: UpdateServiceVisitPayload
  ): Promise<ServiceVisit> {
    const response = await api.patch<ApiResponse<ServiceVisit>>(
      `${MAINTENANCE_PREFIX}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Mark a service visit as completed with detailed results.
   */
  async complete(
    id: string,
    data: CompleteServiceVisitPayload
  ): Promise<ServiceVisit> {
    const response = await api.post<ApiResponse<ServiceVisit>>(
      `${MAINTENANCE_PREFIX}/${id}/complete`,
      data
    );
    return response.data;
  },

  /**
   * Get the maintenance schedule grouped by day for a date range.
   */
  async getSchedule(params?: {
    dateFrom?: string;
    dateTo?: string;
    technicianId?: string;
    clientId?: string;
  }): Promise<ServiceScheduleDay[]> {
    const response = await api.get<ApiResponse<ServiceScheduleDay[]>>(
      `${MAINTENANCE_PREFIX}/schedule`,
      {
        params: {
          dateFrom: params?.dateFrom,
          dateTo: params?.dateTo,
          technicianId: params?.technicianId,
          clientId: params?.clientId,
        },
      }
    );
    return response.data;
  },
};

export default maintenanceService;
