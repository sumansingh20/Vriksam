// =============================================================================
// VRIKSHAM - Clients Service
// =============================================================================

import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  Client,
  ClientFilters,
  Location,
  Plant,
  CreateInput,
  UpdateInput,
} from '@/types';

const CLIENTS_PREFIX = '/clients';

export const clientsService = {
  /**
   * Get paginated list of clients with optional filters.
   */
  async getAll(
    filters?: ClientFilters
  ): Promise<{ clients: Client[]; pagination: PaginationMeta }> {
    const response = await api.get<PaginatedResponse<Client>>(CLIENTS_PREFIX, {
      params: {
        page: filters?.page,
        pageSize: filters?.pageSize,
        sortBy: filters?.sortBy,
        sortOrder: filters?.sortOrder,
        search: filters?.search,
        status: filters?.status,
        subscriptionTier: filters?.subscriptionTier,
        industry: filters?.industry,
        city: filters?.city,
        accountManagerId: filters?.accountManagerId,
        tags: filters?.tags?.join(','),
        hasActiveSubscription: filters?.hasActiveSubscription,
      },
    });
    return { clients: response.data, pagination: response.pagination };
  },

  /**
   * Get a single client by ID.
   */
  async getById(id: string): Promise<Client> {
    const response = await api.get<ApiResponse<Client>>(`${CLIENTS_PREFIX}/${id}`);
    return response.data;
  },

  /**
   * Create a new client.
   */
  async create(data: CreateInput<Client>): Promise<Client> {
    const response = await api.post<ApiResponse<Client>>(CLIENTS_PREFIX, data);
    return response.data;
  },

  /**
   * Update an existing client.
   */
  async update(id: string, data: UpdateInput<Client>): Promise<Client> {
    const response = await api.patch<ApiResponse<Client>>(
      `${CLIENTS_PREFIX}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Soft-delete a client by ID.
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${CLIENTS_PREFIX}/${id}`);
  },

  /**
   * Get all locations for a specific client.
   */
  async getLocations(clientId: string): Promise<Location[]> {
    const response = await api.get<ApiResponse<Location[]>>(
      `${CLIENTS_PREFIX}/${clientId}/locations`
    );
    return response.data;
  },

  /**
   * Get all plants for a specific client.
   */
  async getPlants(clientId: string): Promise<Plant[]> {
    const response = await api.get<ApiResponse<Plant[]>>(
      `${CLIENTS_PREFIX}/${clientId}/plants`
    );
    return response.data;
  },
};

export default clientsService;
