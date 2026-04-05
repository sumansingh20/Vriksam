// =============================================================================
// VRIKSHAM Frontend - Mongoose Models for Next.js API Routes
// =============================================================================
// All Mongoose schemas defined inline for the frontend serverless API routes.
// Mirrors the backend models at backend/src/models/ but consolidated in one
// file so the Next.js frontend can import them without cross-package deps.
//
// Uses mongoose.models check to avoid model re-compilation in serverless
// hot-reload environments.
// =============================================================================

import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// =============================================================================
// ENUMS
// =============================================================================

// User
export enum UserRole {
  USER = 'USER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// Organization
export enum OrganizationType {
  CORPORATE = 'CORPORATE',
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  HOSPITALITY = 'HOSPITALITY',
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Location
export enum LocationType {
  OFFICE = 'OFFICE',
  LOBBY = 'LOBBY',
  CAFETERIA = 'CAFETERIA',
  TERRACE = 'TERRACE',
  BALCONY = 'BALCONY',
  GARDEN = 'GARDEN',
}

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Plant
export enum PlantStatus {
  HEALTHY = 'HEALTHY',
  NEEDS_ATTENTION = 'NEEDS_ATTENTION',
  CRITICAL = 'CRITICAL',
  REPLACED = 'REPLACED',
  REMOVED = 'REMOVED',
}

export enum GrowthStage {
  SEEDLING = 'SEEDLING',
  JUVENILE = 'JUVENILE',
  MATURE = 'MATURE',
  FLOWERING = 'FLOWERING',
}

export enum PlantPlacement {
  FLOOR = 'FLOOR',
  DESK = 'DESK',
  WALL = 'WALL',
  HANGING = 'HANGING',
  OUTDOOR = 'OUTDOOR',
}

// Plant Species
export enum PlantCategory {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
  SUCCULENT = 'SUCCULENT',
  FERN = 'FERN',
  PALM = 'PALM',
  FLOWERING = 'FLOWERING',
}

export enum CareDifficulty {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  HARD = 'HARD',
}

// Subscription
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

// Subscription Plan
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

// Maintenance
export enum MaintenanceType {
  ROUTINE = 'ROUTINE',
  EMERGENCY = 'EMERGENCY',
  REPLACEMENT = 'REPLACEMENT',
  INSTALLATION = 'INSTALLATION',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Payment
export enum PaymentMethod {
  STRIPE = 'STRIPE',
  UPI = 'UPI',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Notification
export enum NotificationType {
  PLANT_HEALTH_ALERT = 'PLANT_HEALTH_ALERT',
  MAINTENANCE_SCHEDULED = 'MAINTENANCE_SCHEDULED',
  MAINTENANCE_COMPLETED = 'MAINTENANCE_COMPLETED',
  PAYMENT_DUE = 'PAYMENT_DUE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SUBSCRIPTION_EXPIRING = 'SUBSCRIPTION_EXPIRING',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// =============================================================================
// INTERFACES
// =============================================================================

// User
export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: Date;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      maintenanceReminders: boolean;
      paymentAlerts: boolean;
      healthAlerts: boolean;
    };
  };
  refreshTokens: Array<{ token: string; expiresAt: Date }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Organization
export interface IOrganizationDocument extends Document {
  name: string;
  type: OrganizationType;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  status: OrganizationStatus;
  gstNumber?: string;
  panNumber?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;
  notes?: string;
  userId: Types.ObjectId;
  partnerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Location
export interface ILocationDocument extends Document {
  name: string;
  organizationId: Types.ObjectId;
  type: LocationType;
  floor?: string;
  area?: number;
  address?: string;
  coordinates?: { lat: number; lng: number };
  plantCapacity: number;
  currentPlantCount: number;
  maintenanceDay?: string;
  status: LocationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Plant
export interface IPlantDocument extends Document {
  plantId: string;
  name: string;
  species: Types.ObjectId;
  locationId: Types.ObjectId;
  organizationId: Types.ObjectId;
  healthScore: number;
  status: PlantStatus;
  growthStage: GrowthStage;
  placement: PlantPlacement;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  installedDate: Date;
  replacementHistory: Array<{ date: Date; reason: string; previousPlant?: string }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Plant Species
export interface IPlantSpeciesDocument extends Document {
  commonName: string;
  scientificName: string;
  category: PlantCategory;
  description: string;
  careInstructions: {
    watering: string;
    sunlight: string;
    temperature: string;
    humidity: string;
    fertilizer: string;
  };
  difficulty: CareDifficulty;
  co2Absorption: number;
  o2Production: number;
  airPurificationScore: number;
  growthRate: string;
  maxHeight: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription
export interface ISubscriptionDocument extends Document {
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

// Subscription Plan
export interface ISubscriptionPlanDocument extends Document {
  name: string;
  slug: string;
  description: string;
  tier: PlanTier;
  price: { monthly: number; quarterly: number; annual: number };
  currency: string;
  features: string[];
  plantLimit: number;
  locationLimit: number;
  supportLevel: SupportLevel;
  isActive: boolean;
  stripePriceIds: { monthly?: string; quarterly?: string; annual?: string };
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Maintenance Log
export interface IMaintenanceLogDocument extends Document {
  plantId: Types.ObjectId;
  locationId: Types.ObjectId;
  organizationId: Types.ObjectId;
  technicianId: Types.ObjectId;
  partnerId?: Types.ObjectId;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: Date;
  completedDate?: Date;
  duration?: number;
  tasks: Array<{ task: string; completed: boolean }>;
  notes?: string;
  healthScoreBefore?: number;
  healthScoreAfter?: number;
  photoBefore?: string;
  photoAfter?: string;
  feedback?: { rating: number; comment?: string };
  materialsUsed: Array<{ name: string; quantity: number; cost: number }>;
  createdAt: Date;
  updatedAt: Date;
}

// Payment
export interface IPaymentDocument extends Document {
  organizationId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  paidAt?: Date;
  dueDate: Date;
  lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification
export interface INotificationDocument extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: Date;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// SCHEMAS & MODELS
// =============================================================================

// ---------------------------------------------------------------------------
// Counter (for auto-generating IDs)
// ---------------------------------------------------------------------------
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
export const Counter = (mongoose.models.Counter as Model<Document>) || mongoose.model('Counter', counterSchema);

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
const refreshTokenSchema = new Schema(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const userPreferencesSchema = new Schema(
  {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      maintenanceReminders: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
      healthAlerts: { type: Boolean, default: true },
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({
        notifications: {
          email: true,
          push: true,
          sms: false,
          maintenanceReminders: true,
          paymentAlerts: true,
          healthAlerts: true,
        },
      }),
    },
    refreshTokens: { type: [refreshTokenSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Pre-save: hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method: compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// toJSON: strip sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.__v;
  return obj;
};

export const User = (mongoose.models.User as Model<IUserDocument>) || mongoose.model<IUserDocument>('User', userSchema);

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------
const addressSchema = new Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
  },
  { _id: false },
);

const contactPersonSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const organizationSchema = new Schema<IOrganizationDocument>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name must be at most 200 characters'],
    },
    type: {
      type: String,
      enum: Object.values(OrganizationType),
      required: [true, 'Organization type is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: { type: String, trim: true },
    address: { type: addressSchema, required: [true, 'Address is required'] },
    contactPerson: { type: contactPersonSchema, required: [true, 'Contact person is required'] },
    status: {
      type: String,
      enum: Object.values(OrganizationStatus),
      default: OrganizationStatus.ACTIVE,
    },
    gstNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    contractStartDate: { type: Date },
    contractEndDate: { type: Date },
    notes: { type: String, trim: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

organizationSchema.index({ name: 1 });
organizationSchema.index({ userId: 1 });
organizationSchema.index({ partnerId: 1 });

organizationSchema.virtual('locations', {
  ref: 'Location',
  localField: '_id',
  foreignField: 'organizationId',
});

organizationSchema.virtual('subscriptions', {
  ref: 'Subscription',
  localField: '_id',
  foreignField: 'organizationId',
});

export const Organization = (mongoose.models.Organization as Model<IOrganizationDocument>) || mongoose.model<IOrganizationDocument>('Organization', organizationSchema);

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------
const coordinatesSchema = new Schema(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: false },
);

const locationSchema = new Schema<ILocationDocument>(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name must be at most 200 characters'],
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    type: {
      type: String,
      enum: Object.values(LocationType),
      required: [true, 'Location type is required'],
    },
    floor: { type: String, trim: true },
    area: { type: Number, min: [0, 'Area cannot be negative'] },
    address: { type: String, trim: true },
    coordinates: { type: coordinatesSchema },
    plantCapacity: {
      type: Number,
      required: [true, 'Plant capacity is required'],
      min: [0, 'Plant capacity cannot be negative'],
    },
    currentPlantCount: {
      type: Number,
      default: 0,
      min: [0, 'Current plant count cannot be negative'],
    },
    maintenanceDay: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    status: {
      type: String,
      enum: Object.values(LocationStatus),
      default: LocationStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

locationSchema.index({ organizationId: 1 });

locationSchema.virtual('plants', {
  ref: 'Plant',
  localField: '_id',
  foreignField: 'locationId',
});

locationSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organizationId',
  foreignField: '_id',
  justOne: true,
});

export const Location = (mongoose.models.Location as Model<ILocationDocument>) || mongoose.model<ILocationDocument>('Location', locationSchema);

// ---------------------------------------------------------------------------
// Plant Species
// ---------------------------------------------------------------------------
const careInstructionsSchema = new Schema(
  {
    watering: { type: String, required: true, trim: true },
    sunlight: { type: String, required: true, trim: true },
    temperature: { type: String, required: true, trim: true },
    humidity: { type: String, required: true, trim: true },
    fertilizer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const plantSpeciesSchema = new Schema<IPlantSpeciesDocument>(
  {
    commonName: {
      type: String,
      required: [true, 'Common name is required'],
      trim: true,
    },
    scientificName: {
      type: String,
      required: [true, 'Scientific name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(PlantCategory),
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    careInstructions: {
      type: careInstructionsSchema,
      required: [true, 'Care instructions are required'],
    },
    difficulty: {
      type: String,
      enum: Object.values(CareDifficulty),
      required: [true, 'Difficulty level is required'],
    },
    co2Absorption: {
      type: Number,
      required: true,
      min: [0, 'CO2 absorption cannot be negative'],
    },
    o2Production: {
      type: Number,
      required: true,
      min: [0, 'O2 production cannot be negative'],
    },
    airPurificationScore: {
      type: Number,
      required: true,
      min: [1, 'Air purification score minimum is 1'],
      max: [10, 'Air purification score maximum is 10'],
    },
    growthRate: { type: String, required: true, trim: true },
    maxHeight: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

plantSpeciesSchema.index({ commonName: 1 });
plantSpeciesSchema.index({ category: 1 });
plantSpeciesSchema.index({ isActive: 1 });

export const PlantSpecies = (mongoose.models.PlantSpecies as Model<IPlantSpeciesDocument>) || mongoose.model<IPlantSpeciesDocument>('PlantSpecies', plantSpeciesSchema);

// ---------------------------------------------------------------------------
// Plant
// ---------------------------------------------------------------------------
const replacementEntrySchema = new Schema(
  {
    date: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    previousPlant: { type: String, trim: true },
  },
  { _id: false },
);

const plantSchema = new Schema<IPlantDocument>(
  {
    plantId: { type: String },
    name: {
      type: String,
      required: [true, 'Plant name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name must be at most 200 characters'],
    },
    species: {
      type: Schema.Types.ObjectId,
      ref: 'PlantSpecies',
      required: [true, 'Species is required'],
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Location ID is required'],
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    healthScore: {
      type: Number,
      default: 85,
      min: [0, 'Health score cannot be below 0'],
      max: [100, 'Health score cannot exceed 100'],
    },
    status: {
      type: String,
      enum: Object.values(PlantStatus),
      default: PlantStatus.HEALTHY,
    },
    growthStage: {
      type: String,
      enum: Object.values(GrowthStage),
      default: GrowthStage.MATURE,
    },
    placement: {
      type: String,
      enum: Object.values(PlantPlacement),
      default: PlantPlacement.FLOOR,
    },
    lastMaintenanceDate: { type: Date },
    nextMaintenanceDate: { type: Date },
    installedDate: { type: Date, default: Date.now },
    replacementHistory: { type: [replacementEntrySchema], default: [] },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

plantSchema.index({ plantId: 1 }, { unique: true });
plantSchema.index({ locationId: 1 });
plantSchema.index({ organizationId: 1 });
plantSchema.index({ status: 1 });

// Pre-save: auto-generate VRK-XXXXX plant ID
plantSchema.pre('save', async function (next) {
  if (this.isNew && !this.plantId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'plantId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );
      this.plantId = `VRK-${String(counter!.get('seq')).padStart(5, '0')}`;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

plantSchema.virtual('speciesInfo', {
  ref: 'PlantSpecies',
  localField: 'species',
  foreignField: '_id',
  justOne: true,
});

plantSchema.virtual('location', {
  ref: 'Location',
  localField: 'locationId',
  foreignField: '_id',
  justOne: true,
});

plantSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organizationId',
  foreignField: '_id',
  justOne: true,
});

export const Plant = (mongoose.models.Plant as Model<IPlantDocument>) || mongoose.model<IPlantDocument>('Plant', plantSchema);

// ---------------------------------------------------------------------------
// Subscription Plan
// ---------------------------------------------------------------------------
const planPriceSchema = new Schema(
  {
    monthly: { type: Number, required: true, min: 0 },
    quarterly: { type: Number, required: true, min: 0 },
    annual: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const stripePriceIdsSchema = new Schema(
  {
    monthly: { type: String, trim: true },
    quarterly: { type: String, trim: true },
    annual: { type: String, trim: true },
  },
  { _id: false },
);

const subscriptionPlanSchema = new Schema<ISubscriptionPlanDocument>(
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
    price: { type: planPriceSchema, required: [true, 'Price is required'] },
    currency: { type: String, default: 'INR', trim: true, uppercase: true },
    features: { type: [String], default: [] },
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
    isActive: { type: Boolean, default: true },
    stripePriceIds: { type: stripePriceIdsSchema, default: () => ({}) },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

subscriptionPlanSchema.index({ slug: 1 }, { unique: true });
subscriptionPlanSchema.index({ tier: 1 });
subscriptionPlanSchema.index({ isActive: 1 });

export const SubscriptionPlan = (mongoose.models.SubscriptionPlan as Model<ISubscriptionPlanDocument>) || mongoose.model<ISubscriptionPlanDocument>('SubscriptionPlan', subscriptionPlanSchema);

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------
const subscriptionSchema = new Schema<ISubscriptionDocument>(
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
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date },
    nextBillingDate: { type: Date, required: [true, 'Next billing date is required'] },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: { type: String, default: 'INR', trim: true, uppercase: true },
    stripeSubscriptionId: { type: String, trim: true },
    stripeCustomerId: { type: String, trim: true },
    autoRenew: { type: Boolean, default: true },
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

subscriptionSchema.index({ organizationId: 1 });
subscriptionSchema.index({ status: 1 });

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

export const Subscription = (mongoose.models.Subscription as Model<ISubscriptionDocument>) || mongoose.model<ISubscriptionDocument>('Subscription', subscriptionSchema);

// ---------------------------------------------------------------------------
// Maintenance Log
// ---------------------------------------------------------------------------
const maintenanceTaskSchema = new Schema(
  {
    task: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false },
);

const maintenanceFeedbackSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { _id: false },
);

const materialUsedSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const maintenanceLogSchema = new Schema<IMaintenanceLogDocument>(
  {
    plantId: {
      type: Schema.Types.ObjectId,
      ref: 'Plant',
      required: [true, 'Plant ID is required'],
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Location ID is required'],
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Technician ID is required'],
    },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: Object.values(MaintenanceType),
      required: [true, 'Maintenance type is required'],
    },
    status: {
      type: String,
      enum: Object.values(MaintenanceStatus),
      default: MaintenanceStatus.SCHEDULED,
    },
    scheduledDate: { type: Date, required: [true, 'Scheduled date is required'] },
    completedDate: { type: Date },
    duration: { type: Number, min: [0, 'Duration cannot be negative'] },
    tasks: { type: [maintenanceTaskSchema], default: [] },
    notes: { type: String, trim: true },
    healthScoreBefore: { type: Number, min: 0, max: 100 },
    healthScoreAfter: { type: Number, min: 0, max: 100 },
    photoBefore: { type: String, trim: true },
    photoAfter: { type: String, trim: true },
    feedback: { type: maintenanceFeedbackSchema },
    materialsUsed: { type: [materialUsedSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

maintenanceLogSchema.index({ plantId: 1 });
maintenanceLogSchema.index({ technicianId: 1 });
maintenanceLogSchema.index({ organizationId: 1 });
maintenanceLogSchema.index({ scheduledDate: 1 });

maintenanceLogSchema.virtual('plant', {
  ref: 'Plant',
  localField: 'plantId',
  foreignField: '_id',
  justOne: true,
});

maintenanceLogSchema.virtual('technician', {
  ref: 'User',
  localField: 'technicianId',
  foreignField: '_id',
  justOne: true,
});

maintenanceLogSchema.virtual('location', {
  ref: 'Location',
  localField: 'locationId',
  foreignField: '_id',
  justOne: true,
});

export const MaintenanceLog = (mongoose.models.MaintenanceLog as Model<IMaintenanceLogDocument>) || mongoose.model<IMaintenanceLogDocument>('MaintenanceLog', maintenanceLogSchema);

// ---------------------------------------------------------------------------
// Payment
// ---------------------------------------------------------------------------
const invoiceCounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
export const InvoiceCounter = (mongoose.models.InvoiceCounter as Model<Document>) || mongoose.model('InvoiceCounter', invoiceCounterSchema);

const lineItemSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const paymentSchema = new Schema<IPaymentDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    invoiceNumber: { type: String },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: { type: String, default: 'INR', trim: true, uppercase: true },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    stripePaymentIntentId: { type: String, trim: true },
    stripeInvoiceId: { type: String, trim: true },
    paidAt: { type: Date },
    dueDate: { type: Date, required: [true, 'Due date is required'] },
    lineItems: { type: [lineItemSchema], default: [] },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

paymentSchema.index({ organizationId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ invoiceNumber: 1 }, { unique: true });

// Pre-save: auto-generate invoice number
paymentSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    try {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const counter = await InvoiceCounter.findByIdAndUpdate(
        'invoiceNumber',
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );
      this.invoiceNumber = `VRK-INV-${yearMonth}-${String(counter!.get('seq')).padStart(4, '0')}`;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

paymentSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organizationId',
  foreignField: '_id',
  justOne: true,
});

paymentSchema.virtual('subscription', {
  ref: 'Subscription',
  localField: 'subscriptionId',
  foreignField: '_id',
  justOne: true,
});

export const Payment = (mongoose.models.Payment as Model<IPaymentDocument>) || mongoose.model<IPaymentDocument>('Payment', paymentSchema);

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------
const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message must be at most 2000 characters'],
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.MEDIUM,
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    actionUrl: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

notificationSchema.index({ userId: 1 });
notificationSchema.index({ isRead: 1 });
// TTL: auto-delete after 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

notificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export const Notification = (mongoose.models.Notification as Model<INotificationDocument>) || mongoose.model<INotificationDocument>('Notification', notificationSchema);
