import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  clientId: z
    .string({ required_error: 'Client ID is required' })
    .uuid('Invalid client ID'),
  planId: z
    .string({ required_error: 'Plan ID is required' })
    .uuid('Invalid plan ID'),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL']).optional().default('MONTHLY'),
  startDate: z.string().datetime().optional(),
  stripeSubscriptionId: z.string().optional().nullable(),
});

export const updateSubscriptionSchema = z.object({
  planId: z.string().uuid('Invalid plan ID').optional(),
  billingCycle: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL']).optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'TRIAL']).optional(),
  endDate: z.string().datetime().optional().nullable(),
  cancelReason: z.string().max(1000, 'Cancel reason must be at most 1000 characters').optional().nullable(),
});

export const pauseSubscriptionSchema = z.object({
  reason: z.string().max(1000, 'Reason must be at most 1000 characters').optional(),
});

export const cancelSubscriptionSchema = z.object({
  reason: z
    .string({ required_error: 'Cancellation reason is required' })
    .min(1, 'Cancellation reason is required')
    .max(1000, 'Reason must be at most 1000 characters'),
  immediate: z.boolean().optional().default(false),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type PauseSubscriptionInput = z.infer<typeof pauseSubscriptionSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
