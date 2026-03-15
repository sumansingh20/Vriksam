import { Request, Response } from 'express';
import prisma from '../config/database';
import authService from '../services/auth.service';
import emailService from '../services/email.service';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export const authController = {
  /**
   * POST /auth/register
   * Register a new user account
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, phone, role } = req.body as RegisterInput;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'An account with this email already exists.',
        });
        return;
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          role: role === 'TECHNICIAN' ? 'TECHNICIAN' : 'CLIENT',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          createdAt: true,
        },
      });

      // If CLIENT role, create client record
      if (user.role === 'CLIENT') {
        await prisma.client.create({
          data: {
            userId: user.id,
            status: 'ACTIVE',
          },
        });
      }

      // If TECHNICIAN role, create technician record
      if (user.role === 'TECHNICIAN') {
        await prisma.technician.create({
          data: {
            userId: user.id,
          },
        });
      }

      // Generate tokens
      const tokens = authService.generateTokenPair(user.id, user.email, user.role);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Send welcome email (non-blocking)
      emailService.sendWelcome({ email: user.email, name: user.name }).catch(console.error);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: {
          user,
          ...tokens,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create account. Please try again.',
      });
    }
  },

  /**
   * POST /auth/login
   * Authenticate user and return tokens
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginInput;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          isActive: true,
          avatar: true,
        },
      });

      if (!user || !user.password) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password.',
        });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: 'Account has been deactivated. Contact support.',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await authService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password.',
        });
        return;
      }

      // Generate tokens
      const tokens = authService.generateTokenPair(user.id, user.email, user.role);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          },
          ...tokens,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed. Please try again.',
      });
    }
  },

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required.',
        });
        return;
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = authService.verifyRefreshToken(refreshToken);
      } catch {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token.',
        });
        return;
      }

      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          error: 'User not found or account deactivated.',
        });
        return;
      }

      // Generate new token pair
      const tokens = authService.generateTokenPair(user.id, user.email, user.role);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully.',
        data: tokens,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh token.',
      });
    }
  },

  /**
   * POST /auth/logout
   * Logout user (client-side token removal; server-side can be extended with token blacklist)
   */
  async logout(_req: Request, res: Response): Promise<void> {
    // In a production system, you would add the token to a blacklist (Redis)
    // For now, we rely on client-side token removal
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  },

  /**
   * GET /auth/me
   * Get current authenticated user profile
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required.',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          phone: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          client: {
            select: {
              id: true,
              companyName: true,
              type: true,
              status: true,
              city: true,
            },
          },
          technician: {
            select: {
              id: true,
              specialization: true,
              rating: true,
              totalVisits: true,
              isAvailable: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile.',
      });
    }
  },

  /**
   * POST /auth/forgot-password
   * Send password reset email
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      // Always return success to prevent email enumeration
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true },
      });

      if (user) {
        const resetToken = authService.generateResetToken(user.id, user.email);

        // Send reset email (non-blocking)
        emailService
          .sendPasswordReset({
            email: user.email,
            name: user.name,
            resetToken,
          })
          .catch(console.error);
      }

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request.',
      });
    }
  },

  /**
   * POST /auth/reset-password
   * Reset password using token from email
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;

      // Verify the reset token
      let decoded;
      try {
        decoded = authService.verifyResetToken(token);
        if (decoded.type !== 'password-reset') {
          throw new Error('Invalid token type');
        }
      } catch {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token.',
        });
        return;
      }

      // Hash new password
      const hashedPassword = await authService.hashPassword(password);

      // Update password
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      res.status(200).json({
        success: true,
        message: 'Password reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password.',
      });
    }
  },
};

export default authController;
