import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/auth.validator';
import authController from '../controllers/auth.controller';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, validate(refreshTokenSchema), authController.refresh);
router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', passwordResetLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, validate(updateProfileSchema), authController.updateMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
