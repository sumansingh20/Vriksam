// =============================================================================
// VRIKSHAM - Subscriptions Hooks
// =============================================================================
// React Query hooks for subscription management.
// =============================================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import subscriptionsService from '@/services/subscriptions.service';
import type {
  SubscriptionFilters,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
} from '@/services/subscriptions.service';
import type {
  Subscription,
  SubscriptionPlan,
  PaginationMeta,
} from '@/types';

// Alias types used by this hook
type CreateSubscriptionData = CreateSubscriptionPayload;
type UpdateSubscriptionData = UpdateSubscriptionPayload;

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters?: SubscriptionFilters) =>
    [...subscriptionKeys.lists(), filters] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionKeys.details(), id] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
};

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

/**
 * Fetch paginated list of subscriptions.
 */
export function useSubscriptions(
  filters?: SubscriptionFilters,
  options?: Omit<
    UseQueryOptions<{ subscriptions: Subscription[]; pagination: PaginationMeta }>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: subscriptionKeys.list(filters),
    queryFn: () => subscriptionsService.getAll(filters),
    ...options,
  });
}

/**
 * Fetch a single subscription by ID.
 */
export function useSubscription(
  id: string,
  options?: Omit<UseQueryOptions<Subscription>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => subscriptionsService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch all available subscription plans.
 */
export function useSubscriptionPlans(
  options?: Omit<UseQueryOptions<SubscriptionPlan[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => subscriptionsService.getPlans(),
    staleTime: 10 * 60 * 1000, // Plans rarely change, cache for 10 minutes
    ...options,
  });
}

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

/**
 * Create a new subscription.
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) =>
      subscriptionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

/**
 * Update a subscription (e.g. change plan).
 */
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSubscriptionData;
    }) => subscriptionsService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.setQueryData(subscriptionKeys.detail(updated.id), updated);
    },
  });
}

/**
 * Pause an active subscription.
 */
export function usePauseSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsService.pause(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.setQueryData(subscriptionKeys.detail(updated.id), updated);
    },
  });
}

/**
 * Resume a paused subscription.
 */
export function useResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsService.resume(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.setQueryData(subscriptionKeys.detail(updated.id), updated);
    },
  });
}

/**
 * Cancel a subscription.
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
      immediate,
    }: {
      id: string;
      reason?: string;
      immediate?: boolean;
    }) => subscriptionsService.cancel(id, { cancellationReason: reason, immediate }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.setQueryData(subscriptionKeys.detail(updated.id), updated);
    },
  });
}
