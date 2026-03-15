// =============================================================================
// VRIKSHAM - Clients Hooks
// =============================================================================
// React Query hooks for client CRUD operations.
// =============================================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import clientsService from '@/services/clients.service';
import type {
  Client,
  ClientFilters,
  Location,
  Plant,
  PaginationMeta,
  CreateInput,
  UpdateInput,
} from '@/types';

// Alias types used by this hook
type CreateClientData = CreateInput<Client>;
type UpdateClientData = UpdateInput<Client>;

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters?: ClientFilters) => [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  locations: (clientId: string) =>
    [...clientKeys.all, 'locations', clientId] as const,
  plants: (clientId: string) =>
    [...clientKeys.all, 'plants', clientId] as const,
};

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

/**
 * Fetch paginated list of clients with optional filters.
 */
export function useClients(
  filters?: ClientFilters,
  options?: Omit<
    UseQueryOptions<{ clients: Client[]; pagination: PaginationMeta }>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => clientsService.getAll(filters),
    ...options,
  });
}

/**
 * Fetch a single client by ID.
 */
export function useClient(
  id: string,
  options?: Omit<UseQueryOptions<Client>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch locations for a specific client.
 */
export function useClientLocations(
  clientId: string,
  options?: Omit<UseQueryOptions<Location[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: clientKeys.locations(clientId),
    queryFn: () => clientsService.getLocations(clientId),
    enabled: !!clientId,
    ...options,
  });
}

/**
 * Fetch plants for a specific client.
 */
export function useClientPlants(
  clientId: string,
  options?: Omit<UseQueryOptions<Plant[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: clientKeys.plants(clientId),
    queryFn: () => clientsService.getPlants(clientId),
    enabled: !!clientId,
    ...options,
  });
}

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

/**
 * Create a new client. Invalidates client list cache on success.
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientData) => clientsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

/**
 * Update an existing client. Invalidates list and detail caches.
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      clientsService.update(id, data),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.setQueryData(
        clientKeys.detail(updatedClient.id),
        updatedClient
      );
    },
  });
}

/**
 * Delete a client. Removes from cache on success.
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.removeQueries({ queryKey: clientKeys.detail(id) });
    },
  });
}
