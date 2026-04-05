import mongoose, { Schema, Document, Model } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export enum PlanTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SupportLevel {
  EMAIL = 'EMAIL',
  PRIORITY = 'PRIORITY',
  DEDICATED = 'DEDICATED',
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface IPlanPrice {
  monthly: number;
  quarterly: number;
  annual: number;
}

export interface IStripePriceIds {
  monthly?: string;
  quarterly?: string;
  annual?: string;
}

export interface ISubscriptionPlan {
  name: string;
  slug: string;
  description: string;
  tier: PlanTier;
  price: IPlanPrice;
  currency: string;
  features: string[];
  plantLimit: number;
  locationLimit: number;
  supportLevel: SupportLevel;
  isActive: boolean;
  stripePriceIds: IStripePriceIds;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionPlanDocument extends ISubscriptionPlan, Document {}
export interface ISubscriptionPlanModel extends Model<ISubscriptionPlanDocument> {}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const planPriceSchema = new Schema<IPlanPrice>(
  {
    monthly: { type: Number, required: true, min: 0 },
    quarterly: { type: Number, required: true, min: 0 },
    annual: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const stripePriceIdsSchema = new Schema<IStripePriceIds>(
  {
    monthly: { type: String, trim: true },
    quarterly: { type: String, trim: true },
    annual: { type: String, trim: true },
  },
  { _id: false },
);

const subscriptionPlanSchema = new Schema<ISubscriptionPlanDocument, ISubscriptionPlanModel>(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    tier: {
      type: String,
      enum: Object.values(PlanTier),
      required: [true, 'Tier is required'],
    },
    price: {
      type: planPriceSchema,
      required: [true, 'Price is required'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
    },
    features: {
      type: [String],
      default: [],
    },
    plantLimit: {
      type: Number,
      required: [true, 'Plant limit is required'],
      min: [0, 'Plant limit cannot be negative'],
    },
    locationLimit: {
      type: Number,
      required: [true, 'Location limit is required'],
      min: [0, 'Location limit cannot be negative'],
    },
    supportLevel: {
      type: String,
      enum: Object.values(SupportLevel),
      required: [true, 'Support level is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stripePriceIds: {
      type: stripePriceIdsSchema,
      default: () => ({}),
    },
    sortOrder: {
      type: Number,
      default: 0,
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
subscriptionPlanSchema.index({ slug: 1 }, { unique: true });
subscriptionPlanSchema.index({ tier: 1 });
subscriptionPlanSchema.index({ isActive: 1 });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const SubscriptionPlan = mongoose.model<ISubscriptionPlanDocument, ISubscriptionPlanModel>(
  'SubscriptionPlan',
  subscriptionPlanSchema,
);
export default SubscriptionPlan;
