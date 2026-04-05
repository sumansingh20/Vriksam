import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters')
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    ),
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number format')
    .optional(),
  role: z.enum(['CLIENT', 'TECHNICIAN']).optional().default('CLIENT'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token is required' })
    .min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((v) => v.toLowerCase().trim()),
});

export const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: 'Reset token is required' })
    .min(1, 'Reset token is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    ),
});

const notificationPreferencesSchema = z
  .object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
    maintenanceReminders: z.boolean().optional(),
    paymentAlerts: z.boolean().optional(),
    healthAlerts: z.boolean().optional(),
  })
  .partial();

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || /^\+?[\d\s-]{10,15}$/.test(value),
        'Invalid phone number format'
      )
      .optional(),
    avatar: z.string().trim().url('Avatar must be a valid URL').optional(),
    preferences: z
      .object({
        notifications: notificationPreferencesSchema.optional(),
      })
      .partial()
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one profile field is required',
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        'Password must contain at least one uppercase, one lowercase, one number, and one special character'
      ),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(1, 'Confirm password is required'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'New password and confirm password must match',
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
