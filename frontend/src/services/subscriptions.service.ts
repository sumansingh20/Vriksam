// =============================================================================
// VRIKSHAM - Subscriptions Service
// =============================================================================

import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  Subscription,
  SubscriptionPlan,
  PaginationParams,
} from '@/types';
import { SubscriptionStatus, SubscriptionTier } from '@/types';

// -----------------------------------------------------------------------------
// Filter Types
// -----------------------------------------------------------------------------

export interface SubscriptionFilters extends PaginationParams {
  status?: SubscriptionStatus;
  tier?: SubscriptionTier;
  clientId?: string;
  billingCycle?: 'monthly' | 'quarterly' | 'annual';
}

export interface CreateSubscriptionPayload {
  clientId: string;
  planId: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  paymentMethodId?: string;
  discountPercentage?: number;
  customTerms?: string;
}

export interface UpdateSubscriptionPayload {
  planId?: string;
  billingCycle?: 'monthly' | 'quarterly' | 'annual';
  autoRenew?: boolean;
  customTerms?: string;
}

const SUBSCRIPTIONS_PREFIX = '/subscriptions';

export const subscriptionsService = {
  /**
   * Get paginated list of subscriptions with optional filters.
   */
  async getAll(
    filters?: SubscriptionFilters
  ): Promise<{ subscriptions: Subscription[]; pagination: PaginationMeta }> {
    const response = await api.get<PaginatedResponse<Subscription>>(
      SUBSCRIPTIONS_PREFIX,
      {
        params: {
          page: filters?.page,
          pageSize: filters?.pageSize,
          sortBy: filters?.sortBy,
          sortOrder: filters?.sortOrder,
          status: filters?.status,
          tier: filters?.tier,
          clientId: filters?.clientId,
          billingCycle: filters?.billingCycle,
        },
      }
    );
    return { subscriptions: response.data, pagination: response.pagination };
  },

  /**
   * Get a single subscription by ID.
   */
  async getById(id: string): Promise<Subscription> {
    const response = await api.get<ApiResponse<Subscription>>(
      `${SUBSCRIPTIONS_PREFIX}/${id}`
    );
    return response.data;
  },

  /**
   * Create a new subscription.
   */
  async create(data: CreateSubscriptionPayload): Promise<Subscription> {
    const response = await api.post<ApiResponse<Subscription>>(
      SUBSCRIPTIONS_PREFIX,
      data
    );
    return response.data;
  },

  /**
   * Update an existing subscription (e.g. change plan or billing cycle).
   */
  async update(id: string, data: UpdateSubscriptionPayload): Promise<Subscription> {
    const response = await api.patch<ApiResponse<Subscription>>(
      `${SUBSCRIPTIONS_PREFIX}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Pause an active subscription.
   */
  async pause(id: string, data?: { resumeDate?: string }): Promise<Subscription> {
    const response = await api.post<ApiResponse<Subscription>>(
      `${SUBSCRIPTIONS_PREFIX}/${id}/pause`,
      data
    );
    return response.data;
  },

  /**
   * Resume a paused subscription.
   */
  async resume(id: string): Promise<Subscription> {
    const response = await api.post<ApiResponse<Subscription>>(
      `${SUBSCRIPTIONS_PREFIX}/${id}/resume`
    );
    return response.data;
  },

  /**
   * Cancel a subscription.
   */
  async cancel(
    id: string,
    data?: { cancellationReason?: string; immediate?: boolean }
  ): Promise<Subscription> {
    const response = await api.post<ApiResponse<Subscription>>(
      `${SUBSCRIPTIONS_PREFIX}/${id}/cancel`,
      data
    );
    return response.data;
  },

  /**
   * Get all available subscription plans.
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get<ApiResponse<SubscriptionPlan[]>>(
      `${SUBSCRIPTIONS_PREFIX}/plans`
    );
    return response.data;
  },
};

export default subscriptionsService;
