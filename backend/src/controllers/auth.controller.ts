import { Request, Response } from 'express';
import User, { UserRole, UserStatus } from '../models/user.model';
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
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'An account with this email already exists.',
        });
        return;
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(password);

      // Determine role (only allow USER or PARTNER from registration)
      const assignedRole = (role as string) === 'PARTNER' ? UserRole.PARTNER : UserRole.USER;

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        phone: phone || undefined,
        role: assignedRole,
        status: UserStatus.ACTIVE,
        emailVerified: false,
      });

      const userId = user._id.toString();

      // Generate tokens
      const tokens = authService.generateTokenPair(userId, user.email, user.role);

      // Update last login
      await User.findByIdAndUpdate(userId, { lastLoginAt: new Date() });

      // Send welcome email (non-blocking)
      emailService.sendWelcome({ email: user.email, name: user.name }).catch(console.error);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: {
          user: {
            id: userId,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
          },
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

      // Find user by email (include password for verification)
      const user = await User.findOne({ email })
        .select('+password')
        .lean();

      if (!user || !user.password) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password.',
        });
        return;
      }

      if (user.status !== UserStatus.ACTIVE) {
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

      const userId = user._id.toString();

      // Generate tokens
      const tokens = authService.generateTokenPair(userId, user.email, user.role);

      // Update last login
      await User.findByIdAndUpdate(userId, { lastLoginAt: new Date() });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: userId,
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
      const user = await User.findById(decoded.userId)
        .select('email role status')
        .lean();

      if (!user || user.status !== UserStatus.ACTIVE) {
        res.status(401).json({
          success: false,
          error: 'User not found or account deactivated.',
        });
        return;
      }

      // Generate new token pair
      const tokens = authService.generateTokenPair(
        user._id.toString(),
        user.email,
        user.role
      );

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
   * Logout user (client-side token removal)
   */
  async logout(_req: Request, res: Response): Promise<void> {
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

      const user = await User.findById(req.user.id)
        .select('-password -refreshTokens -__v')
        .lean();

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          status: user.status,
          emailVerified: user.emailVerified,
          lastLoginAt: user.lastLoginAt,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
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
      const user = await User.findOne({ email }).select('email name').lean();

      if (user) {
        const resetToken = authService.generateResetToken(
          user._id.toString(),
          user.email
        );

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
      await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

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
