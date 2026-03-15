// =============================================================================
// VRIKSHAM - Plants Service
// =============================================================================

import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  Plant,
  PlantFilters,
  PlantHealthLog,
  PlantSpecies,
  CreateInput,
  UpdateInput,
} from '@/types';

const PLANTS_PREFIX = '/plants';

/**
 * Data payload for adding a new health log entry.
 */
export interface AddHealthLogPayload {
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
    followUpDate?: string;
  }>;
  environmentalReadings?: {
    temperature?: number;
    humidity?: number;
    lightLevel?: number;
    soilMoisture?: number;
    soilPh?: number;
  };
  photos?: string[];
}

export const plantsService = {
  /**
   * Get paginated list of plants with optional filters.
   */
  async getAll(
    filters?: PlantFilters
  ): Promise<{ plants: Plant[]; pagination: PaginationMeta }> {
    const response = await api.get<PaginatedResponse<Plant>>(PLANTS_PREFIX, {
      params: {
        page: filters?.page,
        pageSize: filters?.pageSize,
        sortBy: filters?.sortBy,
        sortOrder: filters?.sortOrder,
        search: filters?.search,
        clientId: filters?.clientId,
        locationId: filters?.locationId,
        speciesId: filters?.speciesId,
        healthStatus: filters?.healthStatus,
        growthStage: filters?.growthStage,
        placement: filters?.placement,
        isActive: filters?.isActive,
        healthScoreMin: filters?.healthScoreMin,
        healthScoreMax: filters?.healthScoreMax,
        installedAfter: filters?.installedAfter,
        installedBefore: filters?.installedBefore,
      },
    });
    return { plants: response.data, pagination: response.pagination };
  },

  /**
   * Get a single plant by ID.
   */
  async getById(id: string): Promise<Plant> {
    const response = await api.get<ApiResponse<Plant>>(`${PLANTS_PREFIX}/${id}`);
    return response.data;
  },

  /**
   * Create a new plant.
   */
  async create(data: CreateInput<Plant>): Promise<Plant> {
    const response = await api.post<ApiResponse<Plant>>(PLANTS_PREFIX, data);
    return response.data;
  },

  /**
   * Update an existing plant.
   */
  async update(id: string, data: UpdateInput<Plant>): Promise<Plant> {
    const response = await api.patch<ApiResponse<Plant>>(
      `${PLANTS_PREFIX}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a plant by ID.
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${PLANTS_PREFIX}/${id}`);
  },

  /**
   * Get health logs for a specific plant.
   */
  async getHealthLogs(
    plantId: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<{ logs: PlantHealthLog[]; pagination: PaginationMeta }> {
    const response = await api.get<PaginatedResponse<PlantHealthLog>>(
      `${PLANTS_PREFIX}/${plantId}/health-logs`,
      {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
        },
      }
    );
    return { logs: response.data, pagination: response.pagination };
  },

  /**
   * Add a new health log entry for a plant.
   */
  async addHealthLog(
    plantId: string,
    data: AddHealthLogPayload
  ): Promise<PlantHealthLog> {
    const response = await api.post<ApiResponse<PlantHealthLog>>(
      `${PLANTS_PREFIX}/${plantId}/health-logs`,
      data
    );
    return response.data;
  },

  /**
   * Get all available plant species, optionally filtered.
   */
  async getSpecies(params?: {
    search?: string;
    lightRequirement?: string;
    maintenanceDifficulty?: string;
  }): Promise<PlantSpecies[]> {
    const response = await api.get<ApiResponse<PlantSpecies[]>>(
      `${PLANTS_PREFIX}/species`,
      {
        params: {
          search: params?.search,
          lightRequirement: params?.lightRequirement,
          maintenanceDifficulty: params?.maintenanceDifficulty,
        },
      }
    );
    return response.data;
  },
};

export default plantsService;
