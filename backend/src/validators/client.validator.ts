import { z } from 'zod';

export const createClientSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),
  email: z
    .string()
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim())
    .optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim()
    .optional(),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must be at most 200 characters')
    .trim()
    .optional()
    .nullable(),
  industry: z
    .string()
    .max(100, 'Industry must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
  type: z.enum(['CORPORATE', 'RESIDENTIAL']).optional().default('CORPORATE'),
  address: z
    .string()
    .max(500, 'Address must be at most 500 characters')
    .trim()
    .optional()
    .nullable(),
  city: z
    .string()
    .max(100, 'City must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
  state: z
    .string()
    .max(100, 'State must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
  pincode: z
    .string()
    .regex(/^\d{5,10}$/, 'Invalid pincode format')
    .optional()
    .nullable(),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number')
    .optional()
    .nullable(),
  contactPerson: z
    .string()
    .max(100, 'Contact person must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
  contactPhone: z
    .string()
    .regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number')
    .optional()
    .nullable(),
  contractStartDate: z.string().datetime().optional().nullable(),
  contractEndDate: z.string().datetime().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .nullable(),
});

export const updateClientSchema = createClientSchema.partial();

export const createLocationSchema = z.object({
  name: z
    .string({ required_error: 'Location name is required' })
    .min(1, 'Location name is required')
    .max(200, 'Name must be at most 200 characters')
    .trim(),
  address: z
    .string()
    .max(500, 'Address must be at most 500 characters')
    .trim()
    .optional()
    .nullable(),
  city: z
    .string()
    .max(100, 'City must be at most 100 characters')
    .trim()
    .optional()
    .nullable(),
  floor: z
    .string()
    .max(20, 'Floor must be at most 20 characters')
    .optional()
    .nullable(),
  area: z
    .number()
    .positive('Area must be positive')
    .optional()
    .nullable(),
  type: z.enum([
    'OFFICE', 'BALCONY', 'LOBBY', 'CAFETERIA', 'TERRACE',
    'CORRIDOR', 'CONFERENCE_ROOM', 'RECEPTION', 'RESTROOM', 'OTHER',
  ]).optional().default('OFFICE'),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .nullable(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
