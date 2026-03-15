// =============================================================================
// VRIKSHAM - Maintenance Hooks
// =============================================================================
// React Query hooks for maintenance visit management and scheduling.
// =============================================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import maintenanceService from '@/services/maintenance.service';
import type {
  CreateServiceVisitPayload,
  UpdateServiceVisitPayload,
  CompleteServiceVisitPayload,
  ServiceScheduleDay,
} from '@/services/maintenance.service';
import type {
  ServiceVisit,
  ServiceVisitFilters,
  PaginationMeta,
} from '@/types';

// Alias types used by this hook
type MaintenanceVisit = ServiceVisit;
type CreateMaintenanceData = CreateServiceVisitPayload;
type UpdateMaintenanceData = UpdateServiceVisitPayload;
type CompleteMaintenanceData = CompleteServiceVisitPayload;
type MaintenanceFilters = ServiceVisitFilters;
type MaintenanceSchedule = ServiceScheduleDay;

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const maintenanceKeys = {
  all: ['maintenance'] as const,
  lists: () => [...maintenanceKeys.all, 'list'] as const,
  list: (filters?: MaintenanceFilters) =>
    [...maintenanceKeys.lists(), filters] as const,
  details: () => [...maintenanceKeys.all, 'detail'] as const,
  detail: (id: string) => [...maintenanceKeys.details(), id] as const,
  schedule: (params?: Record<string, string | undefined>) =>
    [...maintenanceKeys.all, 'schedule', params] as const,
};

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

/**
 * Fetch paginated list of maintenance visits (service visits).
 */
export function useServiceVisits(
  filters?: MaintenanceFilters,
  options?: Omit<
    UseQueryOptions<{ visits: MaintenanceVisit[]; pagination: PaginationMeta }>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: maintenanceKeys.list(filters),
    queryFn: () => maintenanceService.getAll(filters),
    ...options,
  });
}

/**
 * Fetch a single maintenance visit by ID.
 */
export function useMaintenanceVisit(
  id: string,
  options?: Omit<UseQueryOptions<MaintenanceVisit>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: maintenanceKeys.detail(id),
    queryFn: () => maintenanceService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch the maintenance schedule for a date range.
 */
export function useSchedule(
  params?: {
    dateFrom?: string;
    dateTo?: string;
    technicianId?: string;
    clientId?: string;
  },
  options?: Omit<
    UseQueryOptions<MaintenanceSchedule[]>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: maintenanceKeys.schedule(params),
    queryFn: () => maintenanceService.getSchedule(params),
    ...options,
  });
}

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

/**
 * Create a new maintenance visit.
 */
export function useCreateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaintenanceData) =>
      maintenanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...maintenanceKeys.all, 'schedule'],
      });
    },
  });
}

/**
 * Update an existing maintenance visit.
 */
export function useUpdateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMaintenanceData;
    }) => maintenanceService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.setQueryData(maintenanceKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({
        queryKey: [...maintenanceKeys.all, 'schedule'],
      });
    },
  });
}

/**
 * Complete a maintenance visit with results data.
 */
export function useCompleteMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CompleteMaintenanceData;
    }) => maintenanceService.complete(id, data),
    onSuccess: (completed) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.setQueryData(
        maintenanceKeys.detail(completed.id),
        completed
      );
      queryClient.invalidateQueries({
        queryKey: [...maintenanceKeys.all, 'schedule'],
      });
      // Also invalidate plant data since health scores may have changed
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });
}
