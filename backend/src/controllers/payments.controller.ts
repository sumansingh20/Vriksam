import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import stripeService from '../services/stripe.service';
import config from '../config';
import { Prisma } from '@prisma/client';

export const paymentsController = {
  /**
   * GET /invoices
   * List invoices with pagination and filters
   */
  async listInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { status, clientId } = req.query;

      const where: Prisma.InvoiceWhereInput = {};

      if (status && typeof status === 'string') {
        where.status = status as Prisma.EnumInvoiceStatusFilter;
      }

      if (clientId && typeof clientId === 'string') {
        where.clientId = clientId;
      }

      // Clients can only see their own invoices
      if (req.user && req.user.role === 'CLIENT') {
        const client = await prisma.client.findUnique({
          where: { userId: req.user.id },
          select: { id: true },
        });
        if (client) {
          where.clientId = client.id;
        }
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: {
            client: {
              select: {
                id: true,
                companyName: true,
                user: { select: { name: true, email: true } },
              },
            },
            subscription: {
              select: {
                id: true,
                plan: { select: { name: true } },
              },
            },
            payments: {
              select: {
                id: true,
                amount: true,
                method: true,
                status: true,
                paidAt: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.invoice.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(invoices, total, page, limit),
      });
    } catch (error) {
      console.error('List invoices error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch invoices.',
      });
    }
  },

  /**
   * GET /invoices/:id
   * Get a single invoice with full details
   */
  async getInvoice(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          client: {
            include: {
              user: { select: { name: true, email: true, phone: true } },
            },
          },
          subscription: {
            include: {
              plan: true,
            },
          },
          payments: true,
        },
      });

      if (!invoice) {
        res.status(404).json({
          success: false,
          error: 'Invoice not found.',
        });
        return;
      }

      // Check access: clients can only see their own invoices
      if (req.user && req.user.role === 'CLIENT') {
        const client = await prisma.client.findUnique({
          where: { userId: req.user.id },
          select: { id: true },
        });
        if (!client || client.id !== invoice.clientId) {
          res.status(403).json({
            success: false,
            error: 'You do not have access to this invoice.',
          });
          return;
        }
      }

      res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      console.error('Get invoice error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch invoice.',
      });
    }
  },

  /**
   * POST /payments/create-checkout
   * Create a Stripe Checkout session for payment
   */
  async createCheckout(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId, priceId } = req.body;

      if (!invoiceId && !priceId) {
        res.status(400).json({
          success: false,
          error: 'Either invoiceId or priceId is required.',
        });
        return;
      }

      let customerEmail: string | undefined;
      let metadata: Record<string, string> = {};

      if (invoiceId) {
        const invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId },
          include: {
            client: {
              include: { user: { select: { email: true } } },
            },
          },
        });

        if (!invoice) {
          res.status(404).json({ success: false, error: 'Invoice not found.' });
          return;
        }

        customerEmail = invoice.client.user.email;
        metadata = {
          invoiceId: invoice.id,
          clientId: invoice.clientId,
        };
      } else if (req.user) {
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { email: true },
        });
        customerEmail = user?.email;
      }

      const successUrl = `${config.app.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${config.app.frontendUrl}/payments/cancelled`;

      const session = await stripeService.createCheckoutSession({
        customerEmail,
        priceId: priceId || 'price_default',
        successUrl,
        cancelUrl,
        metadata,
      });

      res.status(200).json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    } catch (error) {
      console.error('Create checkout error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create checkout session. Please ensure Stripe is configured.',
      });
    }
  },

  /**
   * POST /payments/webhook
   * Handle Stripe webhook events
   */
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;
      if (!signature) {
        res.status(400).json({ success: false, error: 'Missing stripe-signature header.' });
        return;
      }

      let event;
      try {
        event = stripeService.constructWebhookEvent(req.body as Buffer, signature);
      } catch {
        res.status(400).json({ success: false, error: 'Invalid webhook signature.' });
        return;
      }

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as { metadata?: Record<string, string>; payment_status?: string };
          const invoiceId = session.metadata?.invoiceId;

          if (invoiceId && session.payment_status === 'paid') {
            await prisma.invoice.update({
              where: { id: invoiceId },
              data: {
                status: 'PAID',
                paidDate: new Date(),
              },
            });
          }
          break;
        }

        case 'invoice.paid': {
          const stripeInvoice = event.data.object as { id?: string; amount_paid?: number };
          const invoiceRecord = await prisma.invoice.findFirst({
            where: { stripeInvoiceId: stripeInvoice.id },
          });

          if (invoiceRecord) {
            await prisma.invoice.update({
              where: { id: invoiceRecord.id },
              data: { status: 'PAID', paidDate: new Date() },
            });

            await prisma.payment.create({
              data: {
                invoiceId: invoiceRecord.id,
                amount: (stripeInvoice.amount_paid || 0) / 100,
                method: 'STRIPE',
                status: 'SUCCESS',
                paidAt: new Date(),
                stripePaymentId: stripeInvoice.id,
              },
            });
          }
          break;
        }

        case 'invoice.payment_failed': {
          const failedInvoice = event.data.object as { id?: string };
          const failedRecord = await prisma.invoice.findFirst({
            where: { stripeInvoiceId: failedInvoice.id },
          });

          if (failedRecord) {
            await prisma.invoice.update({
              where: { id: failedRecord.id },
              data: { status: 'OVERDUE' },
            });
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const deletedSub = event.data.object as { id?: string };
          const subRecord = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: deletedSub.id },
          });

          if (subRecord) {
            await prisma.subscription.update({
              where: { id: subRecord.id },
              data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
              },
            });
          }
          break;
        }

        case 'customer.subscription.updated': {
          const updatedSub = event.data.object as { id?: string; status?: string };
          const existingSub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: updatedSub.id },
          });

          if (existingSub && updatedSub.status) {
            const statusMap: Record<string, string> = {
              active: 'ACTIVE',
              past_due: 'ACTIVE',
              canceled: 'CANCELLED',
              unpaid: 'EXPIRED',
              paused: 'PAUSED',
            };
            const mappedStatus = statusMap[updatedSub.status];
            if (mappedStatus) {
              await prisma.subscription.update({
                where: { id: existingSub.id },
                data: {
                  status: mappedStatus as 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED',
                },
              });
            }
          }
          break;
        }

        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      // Acknowledge receipt
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Webhook processing failed.',
      });
    }
  },
};

export default paymentsController;
