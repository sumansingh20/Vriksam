import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface IOrganization {
  name: string;
  type: OrganizationType;
  email: string;
  phone?: string;
  address: IAddress;
  contactPerson: IContactPerson;
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

export interface IOrganizationDocument extends IOrganization, Document {}
export interface IOrganizationModel extends Model<IOrganizationDocument> {}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const addressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
  },
  { _id: false },
);

const contactPersonSchema = new Schema<IContactPerson>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const organizationSchema = new Schema<IOrganizationDocument, IOrganizationModel>(
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
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: addressSchema,
      required: [true, 'Address is required'],
    },
    contactPerson: {
      type: contactPersonSchema,
      required: [true, 'Contact person is required'],
    },
    status: {
      type: String,
      enum: Object.values(OrganizationStatus),
      default: OrganizationStatus.ACTIVE,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    contractStartDate: {
      type: Date,
    },
    contractEndDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
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

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
organizationSchema.index({ name: 1 });
organizationSchema.index({ userId: 1 });
organizationSchema.index({ partnerId: 1 });

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const Organization = mongoose.model<IOrganizationDocument, IOrganizationModel>(
  'Organization',
  organizationSchema,
);
export default Organization;
