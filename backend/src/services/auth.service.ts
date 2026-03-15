import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';
import { JwtPayload } from '../types';

const SALT_ROUNDS = 12;

export const authService = {
  /**
   * Hash a plaintext password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Compare a plaintext password against a bcrypt hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  /**
   * Generate an access token (short-lived)
   */
  generateAccessToken(userId: string, email: string, role: string): string {
    const payload: JwtPayload = { userId, email, role };
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  },

  /**
   * Generate a refresh token (long-lived)
   */
  generateRefreshToken(userId: string, email: string, role: string): string {
    const payload: JwtPayload = { userId, email, role };
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);
  },

  /**
   * Generate both access and refresh tokens
   */
  generateTokenPair(userId: string, email: string, role: string): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(userId, email, role),
      refreshToken: this.generateRefreshToken(userId, email, role),
    };
  },

  /**
   * Verify an access token and return the decoded payload
   */
  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  },

  /**
   * Verify a refresh token and return the decoded payload
   */
  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  },

  /**
   * Generate a password reset token (short-lived, 1 hour)
   */
  generateResetToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email, type: 'password-reset' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
  },

  /**
   * Verify a password reset token
   */
  verifyResetToken(token: string): { userId: string; email: string; type: string } {
    return jwt.verify(token, config.jwt.secret) as {
      userId: string;
      email: string;
      type: string;
    };
  },
};

export default authService;
