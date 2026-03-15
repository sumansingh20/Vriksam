import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import stripeService from '../services/stripe.service';
import { Prisma } from '@prisma/client';

export const subscriptionsController = {
  /**
   * GET /subscriptions
   * List all subscriptions with pagination and filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { status, clientId, planId } = req.query;

      const where: Prisma.SubscriptionWhereInput = {};

      if (status && typeof status === 'string') {
        where.status = status as Prisma.EnumSubscriptionStatusFilter;
      }

      if (clientId && typeof clientId === 'string') {
        where.clientId = clientId;
      }

      if (planId && typeof planId === 'string') {
        where.planId = planId;
      }

      // Non-admin users can only see their own subscriptions
      if (req.user && req.user.role === 'CLIENT') {
        const client = await prisma.client.findUnique({
          where: { userId: req.user.id },
          select: { id: true },
        });
        if (client) {
          where.clientId = client.id;
        }
      }

      const [subscriptions, total] = await Promise.all([
        prisma.subscription.findMany({
          where,
          include: {
            plan: true,
            client: {
              select: {
                id: true,
                companyName: true,
                user: { select: { name: true, email: true } },
              },
            },
            _count: { select: { invoices: true } },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.subscription.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(subscriptions, total, page, limit),
      });
    } catch (error) {
      console.error('List subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subscriptions.',
      });
    }
  },

  /**
   * GET /subscriptions/:id
   * Get a single subscription with details
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: {
          plan: true,
          client: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
          invoices: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!subscription) {
        res.status(404).json({
          success: false,
          error: 'Subscription not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subscription.',
      });
    }
  },

  /**
   * POST /subscriptions
   * Create a new subscription
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Validate client exists
      const client = await prisma.client.findUnique({
        where: { id: data.clientId },
        include: { user: { select: { email: true, name: true } } },
      });
      if (!client) {
        res.status(404).json({ success: false, error: 'Client not found.' });
        return;
      }

      // Validate plan exists
      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: data.planId } });
      if (!plan) {
        res.status(404).json({ success: false, error: 'Subscription plan not found.' });
        return;
      }

      // Check for existing active subscription
      const existingActive = await prisma.subscription.findFirst({
        where: {
          clientId: data.clientId,
          status: { in: ['ACTIVE', 'TRIAL'] },
        },
      });
      if (existingActive) {
        res.status(409).json({
          success: false,
          error: 'Client already has an active subscription. Please cancel the existing one first.',
        });
        return;
      }

      const subscription = await prisma.subscription.create({
        data: {
          clientId: data.clientId,
          planId: data.planId,
          billingCycle: data.billingCycle || 'MONTHLY',
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          status: 'ACTIVE',
          stripeSubscriptionId: data.stripeSubscriptionId || null,
        },
        include: { plan: true },
      });

      res.status(201).json({
        success: true,
        message: 'Subscription created successfully.',
        data: subscription,
      });
    } catch (error) {
      console.error('Create subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create subscription.',
      });
    }
  },

  /**
   * PUT /subscriptions/:id
   * Update a subscription
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updateData: Prisma.SubscriptionUpdateInput = {};
      if (data.planId !== undefined) updateData.plan = { connect: { id: data.planId } };
      if (data.billingCycle !== undefined) updateData.billingCycle = data.billingCycle;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;

      const subscription = await prisma.subscription.update({
        where: { id },
        data: updateData,
        include: { plan: true },
      });

      res.status(200).json({
        success: true,
        message: 'Subscription updated successfully.',
        data: subscription,
      });
    } catch (error) {
      console.error('Update subscription error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Subscription not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update subscription.',
      });
    }
  },

  /**
   * DELETE /subscriptions/:id
   * Cancel a subscription (same as cancel endpoint)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subscription = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: 'Deleted by user/admin',
        },
        select: { id: true, status: true },
      });

      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully.',
        data: subscription,
      });
    } catch (error) {
      console.error('Delete subscription error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Subscription not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription.',
      });
    }
  },

  /**
   * POST /subscriptions/:id/pause
   * Pause an active subscription
   */
  async pause(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const subscription = await prisma.subscription.findUnique({ where: { id } });
      if (!subscription) {
        res.status(404).json({ success: false, error: 'Subscription not found.' });
        return;
      }

      if (subscription.status !== 'ACTIVE') {
        res.status(400).json({
          success: false,
          error: `Cannot pause subscription with status: ${subscription.status}. Only ACTIVE subscriptions can be paused.`,
        });
        return;
      }

      // Pause on Stripe if applicable
      if (subscription.stripeSubscriptionId) {
        try {
          await stripeService.pauseSubscription(subscription.stripeSubscriptionId);
        } catch (stripeError) {
          console.error('Stripe pause error:', stripeError);
          // Continue with local pause even if Stripe fails
        }
      }

      const updated = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'PAUSED',
          cancelReason: reason || 'Paused by user',
        },
        include: { plan: true },
      });

      res.status(200).json({
        success: true,
        message: 'Subscription paused successfully.',
        data: updated,
      });
    } catch (error) {
      console.error('Pause subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to pause subscription.',
      });
    }
  },

  /**
   * POST /subscriptions/:id/resume
   * Resume a paused subscription
   */
  async resume(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subscription = await prisma.subscription.findUnique({ where: { id } });
      if (!subscription) {
        res.status(404).json({ success: false, error: 'Subscription not found.' });
        return;
      }

      if (subscription.status !== 'PAUSED') {
        res.status(400).json({
          success: false,
          error: `Cannot resume subscription with status: ${subscription.status}. Only PAUSED subscriptions can be resumed.`,
        });
        return;
      }

      // Resume on Stripe if applicable
      if (subscription.stripeSubscriptionId) {
        try {
          await stripeService.resumeSubscription(subscription.stripeSubscriptionId);
        } catch (stripeError) {
          console.error('Stripe resume error:', stripeError);
        }
      }

      const updated = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          cancelReason: null,
        },
        include: { plan: true },
      });

      res.status(200).json({
        success: true,
        message: 'Subscription resumed successfully.',
        data: updated,
      });
    } catch (error) {
      console.error('Resume subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resume subscription.',
      });
    }
  },

  /**
   * POST /subscriptions/:id/cancel
   * Cancel a subscription with reason
   */
  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason, immediate } = req.body;

      const subscription = await prisma.subscription.findUnique({ where: { id } });
      if (!subscription) {
        res.status(404).json({ success: false, error: 'Subscription not found.' });
        return;
      }

      if (subscription.status === 'CANCELLED') {
        res.status(400).json({
          success: false,
          error: 'Subscription is already cancelled.',
        });
        return;
      }

      // Cancel on Stripe if applicable
      if (subscription.stripeSubscriptionId) {
        try {
          await stripeService.cancelSubscription(subscription.stripeSubscriptionId, immediate);
        } catch (stripeError) {
          console.error('Stripe cancel error:', stripeError);
        }
      }

      const updated = await prisma.subscription.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: reason || 'Cancelled by user',
          endDate: immediate ? new Date() : subscription.endDate,
        },
        include: { plan: true },
      });

      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully.',
        data: updated,
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription.',
      });
    }
  },
};

export default subscriptionsController;
