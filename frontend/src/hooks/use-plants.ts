// =============================================================================
// VRIKSHAM - Plants Hooks
// =============================================================================
// React Query hooks for plant CRUD operations, health logs, and species.
// =============================================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import plantsService from '@/services/plants.service';
import type { AddHealthLogPayload } from '@/services/plants.service';
import type {
  Plant,
  PlantFilters,
  PlantHealthLog,
  PlantSpecies,
  PaginationMeta,
  CreateInput,
  UpdateInput,
} from '@/types';

// Alias types used by this hook
type CreatePlantData = CreateInput<Plant>;
type UpdatePlantData = UpdateInput<Plant>;
type AddHealthLogData = AddHealthLogPayload;

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const plantKeys = {
  all: ['plants'] as const,
  lists: () => [...plantKeys.all, 'list'] as const,
  list: (filters?: PlantFilters) => [...plantKeys.lists(), filters] as const,
  details: () => [...plantKeys.all, 'detail'] as const,
  detail: (id: string) => [...plantKeys.details(), id] as const,
  healthLogs: (plantId: string) =>
    [...plantKeys.all, 'healthLogs', plantId] as const,
  species: (params?: { search?: string; category?: string }) =>
    [...plantKeys.all, 'species', params] as const,
};

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

/**
 * Fetch paginated list of plants with optional filters.
 */
export function usePlants(
  filters?: PlantFilters,
  options?: Omit<
    UseQueryOptions<{ plants: Plant[]; pagination: PaginationMeta }>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: plantKeys.list(filters),
    queryFn: () => plantsService.getAll(filters),
    ...options,
  });
}

/**
 * Fetch a single plant by ID.
 */
export function usePlant(
  id: string,
  options?: Omit<UseQueryOptions<Plant>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: plantKeys.detail(id),
    queryFn: () => plantsService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch health logs for a specific plant.
 */
export function usePlantHealthLogs(
  plantId: string,
  params?: { page?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<{ logs: PlantHealthLog[]; pagination: PaginationMeta }>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...plantKeys.healthLogs(plantId), params],
    queryFn: () => plantsService.getHealthLogs(plantId, params),
    enabled: !!plantId,
    ...options,
  });
}

/**
 * Fetch available plant species.
 */
export function usePlantSpecies(
  params?: { search?: string; category?: string },
  options?: Omit<UseQueryOptions<PlantSpecies[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: plantKeys.species(params),
    queryFn: () => plantsService.getSpecies(params),
    ...options,
  });
}

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

/**
 * Create a new plant. Invalidates plant list cache on success.
 */
export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlantData) => plantsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.lists() });
    },
  });
}

/**
 * Update an existing plant. Invalidates both list and detail caches.
 */
export function useUpdatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlantData }) =>
      plantsService.update(id, data),
    onSuccess: (updatedPlant) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.lists() });
      queryClient.setQueryData(
        plantKeys.detail(updatedPlant.id),
        updatedPlant
      );
    },
  });
}

/**
 * Delete a plant. Removes from cache on success.
 */
export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plantsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.lists() });
      queryClient.removeQueries({ queryKey: plantKeys.detail(id) });
    },
  });
}

/**
 * Add a health log entry for a plant.
 */
export function useAddPlantHealthLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      plantId,
      data,
    }: {
      plantId: string;
      data: AddHealthLogData;
    }) => plantsService.addHealthLog(plantId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: plantKeys.healthLogs(variables.plantId),
      });
      queryClient.invalidateQueries({
        queryKey: plantKeys.detail(variables.plantId),
      });
    },
  });
}
