import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface IMaintenanceTask {
  task: string;
  completed: boolean;
}

export interface IMaintenanceFeedback {
  rating: number;
  comment?: string;
}

export interface IMaterialUsed {
  name: string;
  quantity: number;
  cost: number;
}

export interface IMaintenanceLog {
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
  tasks: IMaintenanceTask[];
  notes?: string;
  healthScoreBefore?: number;
  healthScoreAfter?: number;
  photoBefore?: string;
  photoAfter?: string;
  feedback?: IMaintenanceFeedback;
  materialsUsed: IMaterialUsed[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMaintenanceLogDocument extends IMaintenanceLog, Document {}
export interface IMaintenanceLogModel extends Model<IMaintenanceLogDocument> {}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const maintenanceTaskSchema = new Schema<IMaintenanceTask>(
  {
    task: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false },
);

const maintenanceFeedbackSchema = new Schema<IMaintenanceFeedback>(
  {
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating minimum is 1'],
      max: [5, 'Rating maximum is 5'],
    },
    comment: { type: String, trim: true },
  },
  { _id: false },
);

const materialUsedSchema = new Schema<IMaterialUsed>(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const maintenanceLogSchema = new Schema<IMaintenanceLogDocument, IMaintenanceLogModel>(
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
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
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
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    completedDate: {
      type: Date,
    },
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
    },
    tasks: {
      type: [maintenanceTaskSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    healthScoreBefore: {
      type: Number,
      min: 0,
      max: 100,
    },
    healthScoreAfter: {
      type: Number,
      min: 0,
      max: 100,
    },
    photoBefore: {
      type: String,
      trim: true,
    },
    photoAfter: {
      type: String,
      trim: true,
    },
    feedback: {
      type: maintenanceFeedbackSchema,
    },
    materialsUsed: {
      type: [materialUsedSchema],
      default: [],
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
maintenanceLogSchema.index({ plantId: 1 });
maintenanceLogSchema.index({ technicianId: 1 });
maintenanceLogSchema.index({ organizationId: 1 });
maintenanceLogSchema.index({ scheduledDate: 1 });

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const MaintenanceLog = mongoose.model<IMaintenanceLogDocument, IMaintenanceLogModel>(
  'MaintenanceLog',
  maintenanceLogSchema,
);
export default MaintenanceLog;
