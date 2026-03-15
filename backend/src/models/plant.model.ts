import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface IReplacementEntry {
  date: Date;
  reason: string;
  previousPlant?: string;
}

export interface IPlant {
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
  replacementHistory: IReplacementEntry[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlantDocument extends IPlant, Document {}
export interface IPlantModel extends Model<IPlantDocument> {}

// ---------------------------------------------------------------------------
// Counter schema for auto-generating plant IDs
// ---------------------------------------------------------------------------
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const replacementEntrySchema = new Schema<IReplacementEntry>(
  {
    date: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    previousPlant: { type: String, trim: true },
  },
  { _id: false },
);

const plantSchema = new Schema<IPlantDocument, IPlantModel>(
  {
    plantId: {
      type: String,
      unique: true,
    },
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
    lastMaintenanceDate: {
      type: Date,
    },
    nextMaintenanceDate: {
      type: Date,
    },
    installedDate: {
      type: Date,
      default: Date.now,
    },
    replacementHistory: {
      type: [replacementEntrySchema],
      default: [],
    },
    notes: {
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
plantSchema.index({ plantId: 1 }, { unique: true });
plantSchema.index({ locationId: 1 });
plantSchema.index({ organizationId: 1 });
plantSchema.index({ status: 1 });

// ---------------------------------------------------------------------------
// Pre-save hook: auto-generate VRK-XXXXX plant ID
// ---------------------------------------------------------------------------
plantSchema.pre('save', async function (next) {
  if (this.isNew && !this.plantId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'plantId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );
      this.plantId = `VRK-${String(counter.seq).padStart(5, '0')}`;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const Plant = mongoose.model<IPlantDocument, IPlantModel>('Plant', plantSchema);
export default Plant;
