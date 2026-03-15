import Stripe from 'stripe';
import config from '../config';

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, { apiVersion: '2025-02-24.acacia' })
  : null;

function getStripe(): Stripe {
  if (!stripe) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in environment.');
  }
  return stripe;
}

export const stripeService = {
  /**
   * Create a Stripe customer for a new client
   */
  async createCustomer(params: {
    email: string;
    name: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    const s = getStripe();
    return s.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata || {},
    });
  },

  /**
   * Create a Stripe subscription for a customer
   */
  async createSubscription(params: {
    customerId: string;
    priceId: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Subscription> {
    const s = getStripe();
    return s.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: params.metadata || {},
    });
  },

  /**
   * Cancel a Stripe subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    immediate: boolean = false
  ): Promise<Stripe.Subscription> {
    const s = getStripe();
    if (immediate) {
      return s.subscriptions.cancel(subscriptionId);
    }
    return s.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  },

  /**
   * Pause a Stripe subscription by setting pause_collection
   */
  async pauseSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const s = getStripe();
    return s.subscriptions.update(subscriptionId, {
      pause_collection: { behavior: 'void' },
    });
  },

  /**
   * Resume a paused Stripe subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const s = getStripe();
    return s.subscriptions.update(subscriptionId, {
      pause_collection: '',
    } as Stripe.SubscriptionUpdateParams);
  },

  /**
   * Create a Stripe Checkout session for payment
   */
  async createCheckoutSession(params: {
    customerId?: string;
    customerEmail?: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    const s = getStripe();
    return s.checkout.sessions.create({
      customer: params.customerId,
      customer_email: params.customerId ? undefined : params.customerEmail,
      mode: 'subscription',
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata || {},
    });
  },

  /**
   * Construct and verify a Stripe webhook event
   */
  constructWebhookEvent(
    body: Buffer,
    signature: string
  ): Stripe.Event {
    const s = getStripe();
    return s.webhooks.constructEvent(
      body,
      signature,
      config.stripe.webhookSecret
    );
  },

  /**
   * Create a Stripe invoice for a customer
   */
  async createInvoice(params: {
    customerId: string;
    amount: number;
    description: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Invoice> {
    const s = getStripe();

    // Create an invoice item first
    await s.invoiceItems.create({
      customer: params.customerId,
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: 'inr',
      description: params.description,
    });

    // Then create and finalize the invoice
    const invoice = await s.invoices.create({
      customer: params.customerId,
      auto_advance: true,
      metadata: params.metadata || {},
    });

    return s.invoices.finalizeInvoice(invoice.id);
  },

  /**
   * Retrieve a Stripe customer
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    const s = getStripe();
    return s.customers.retrieve(customerId);
  },

  /**
   * Retrieve a Stripe subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const s = getStripe();
    return s.subscriptions.retrieve(subscriptionId);
  },

  /**
   * List invoices for a customer
   */
  async listInvoices(customerId: string, limit: number = 10): Promise<Stripe.ApiList<Stripe.Invoice>> {
    const s = getStripe();
    return s.invoices.list({
      customer: customerId,
      limit,
    });
  },
};

export default stripeService;
