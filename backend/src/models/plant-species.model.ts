import mongoose, { Schema, Document, Model } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface ICareInstructions {
  watering: string;
  sunlight: string;
  temperature: string;
  humidity: string;
  fertilizer: string;
}

export interface IPlantSpecies {
  commonName: string;
  scientificName: string;
  category: PlantCategory;
  description: string;
  careInstructions: ICareInstructions;
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

export interface IPlantSpeciesDocument extends IPlantSpecies, Document {}
export interface IPlantSpeciesModel extends Model<IPlantSpeciesDocument> {}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const careInstructionsSchema = new Schema<ICareInstructions>(
  {
    watering: { type: String, required: true, trim: true },
    sunlight: { type: String, required: true, trim: true },
    temperature: { type: String, required: true, trim: true },
    humidity: { type: String, required: true, trim: true },
    fertilizer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const plantSpeciesSchema = new Schema<IPlantSpeciesDocument, IPlantSpeciesModel>(
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
    growthRate: {
      type: String,
      required: true,
      trim: true,
    },
    maxHeight: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
plantSpeciesSchema.index({ commonName: 1 });
plantSpeciesSchema.index({ category: 1 });
plantSpeciesSchema.index({ isActive: 1 });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const PlantSpecies = mongoose.model<IPlantSpeciesDocument, IPlantSpeciesModel>(
  'PlantSpecies',
  plantSpeciesSchema,
);
export default PlantSpecies;
