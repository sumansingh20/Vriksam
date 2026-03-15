import { z } from 'zod';

export const createPlantSchema = z.object({
  speciesId: z
    .string({ required_error: 'Species ID is required' })
    .uuid('Invalid species ID'),
  locationId: z
    .string({ required_error: 'Location ID is required' })
    .uuid('Invalid location ID'),
  nickname: z
    .string()
    .max(100, 'Nickname must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
  status: z.enum(['HEALTHY', 'NEEDS_ATTENTION', 'CRITICAL', 'REPLACED', 'REMOVED']).optional().default('HEALTHY'),
  qrCode: z
    .string()
    .max(500, 'QR code must be at most 500 characters')
    .optional()
    .nullable(),
  wateringCycle: z
    .number()
    .int('Watering cycle must be an integer')
    .min(1, 'Watering cycle must be at least 1 day')
    .max(90, 'Watering cycle must be at most 90 days')
    .optional()
    .default(3),
  growthStage: z.enum(['SEEDLING', 'JUVENILE', 'MATURE', 'FLOWERING', 'DORMANT']).optional().default('MATURE'),
  placedDate: z.string().datetime().optional(),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .nullable(),
});

export const updatePlantSchema = createPlantSchema.partial();

export const healthLogSchema = z.object({
  healthScore: z
    .number({ required_error: 'Health score is required' })
    .min(0, 'Health score must be at least 0')
    .max(100, 'Health score must be at most 100'),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .nullable(),
  diseaseDetected: z
    .string()
    .max(500, 'Disease description must be at most 500 characters')
    .optional()
    .nullable(),
  imageUrl: z
    .string()
    .url('Invalid image URL')
    .optional()
    .nullable(),
  temperature: z
    .number()
    .min(-50, 'Temperature too low')
    .max(60, 'Temperature too high')
    .optional()
    .nullable(),
  humidity: z
    .number()
    .min(0, 'Humidity must be at least 0')
    .max(100, 'Humidity must be at most 100')
    .optional()
    .nullable(),
  soilMoisture: z
    .number()
    .min(0, 'Soil moisture must be at least 0')
    .max(100, 'Soil moisture must be at most 100')
    .optional()
    .nullable(),
  lightLevel: z
    .number()
    .min(0, 'Light level must be at least 0')
    .optional()
    .nullable(),
  aiAnalysis: z
    .string()
    .max(5000, 'AI analysis must be at most 5000 characters')
    .optional()
    .nullable(),
  recommendations: z
    .string()
    .max(5000, 'Recommendations must be at most 5000 characters')
    .optional()
    .nullable(),
});

export const createSpeciesSchema = z.object({
  commonName: z
    .string({ required_error: 'Common name is required' })
    .min(2, 'Common name must be at least 2 characters')
    .max(200, 'Common name must be at most 200 characters')
    .trim(),
  scientificName: z
    .string({ required_error: 'Scientific name is required' })
    .min(2, 'Scientific name must be at least 2 characters')
    .max(200, 'Scientific name must be at most 200 characters')
    .trim(),
  category: z
    .string({ required_error: 'Category is required' })
    .min(1, 'Category is required')
    .max(100, 'Category must be at most 100 characters')
    .trim(),
  lightRequirement: z.enum(['LOW', 'MEDIUM', 'HIGH', 'DIRECT_SUNLIGHT']).optional().default('MEDIUM'),
  wateringFrequency: z
    .number()
    .int()
    .min(1, 'Watering frequency must be at least 1')
    .max(90, 'Watering frequency must be at most 90')
    .optional()
    .default(3),
  difficulty: z.enum(['EASY', 'MODERATE', 'HARD', 'EXPERT']).optional().default('MODERATE'),
  airPurifyingScore: z
    .number()
    .min(0)
    .max(10)
    .optional()
    .default(0),
  co2AbsorptionRate: z
    .number()
    .min(0)
    .optional()
    .default(0),
  oxygenProductionRate: z
    .number()
    .min(0)
    .optional()
    .default(0),
  humidityPreference: z.string().max(100).optional().nullable(),
  temperatureMin: z.number().optional().nullable(),
  temperatureMax: z.number().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  careInstructions: z.string().max(5000).optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
});

export type CreatePlantInput = z.infer<typeof createPlantSchema>;
export type UpdatePlantInput = z.infer<typeof updatePlantSchema>;
export type HealthLogInput = z.infer<typeof healthLogSchema>;
export type CreateSpeciesInput = z.infer<typeof createSpeciesSchema>;
