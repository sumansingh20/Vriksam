import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface ISubscription {
  organizationId: Types.ObjectId;
  planId: Types.ObjectId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: Date;
  endDate?: Date;
  nextBillingDate: Date;
  amount: number;
  currency: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  autoRenew: boolean;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionDocument extends ISubscription, Document {}
export interface ISubscriptionModel extends Model<ISubscriptionDocument> {}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const subscriptionSchema = new Schema<ISubscriptionDocument, ISubscriptionModel>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: [true, 'Plan ID is required'],
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
    },
    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
      required: [true, 'Billing cycle is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    nextBillingDate: {
      type: Date,
      required: [true, 'Next billing date is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
    },
    stripeSubscriptionId: {
      type: String,
      trim: true,
    },
    stripeCustomerId: {
      type: String,
      trim: true,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
subscriptionSchema.index({ organizationId: 1 });
subscriptionSchema.index({ status: 1 });

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------
subscriptionSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organizationId',
  foreignField: '_id',
  justOne: true,
});

subscriptionSchema.virtual('plan', {
  ref: 'SubscriptionPlan',
  localField: 'planId',
  foreignField: '_id',
  justOne: true,
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const Subscription = mongoose.model<ISubscriptionDocument, ISubscriptionModel>(
  'Subscription',
  subscriptionSchema,
);
export default Subscription;
