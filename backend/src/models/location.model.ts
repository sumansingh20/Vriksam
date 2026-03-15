import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface ILocation {
  name: string;
  organizationId: Types.ObjectId;
  type: LocationType;
  floor?: string;
  area?: number;
  address?: string;
  coordinates?: ICoordinates;
  plantCapacity: number;
  currentPlantCount: number;
  maintenanceDay?: string;
  status: LocationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocationDocument extends ILocation, Document {}
export interface ILocationModel extends Model<ILocationDocument> {}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const coordinatesSchema = new Schema<ICoordinates>(
  {
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: false },
);

const locationSchema = new Schema<ILocationDocument, ILocationModel>(
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
    floor: {
      type: String,
      trim: true,
    },
    area: {
      type: Number,
      min: [0, 'Area cannot be negative'],
    },
    address: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: coordinatesSchema,
    },
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

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
locationSchema.index({ organizationId: 1 });

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const Location = mongoose.model<ILocationDocument, ILocationModel>('Location', locationSchema);
export default Location;
