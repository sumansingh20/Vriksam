// =============================================================================
// VRIKSHAM Frontend - JWT Authentication Utility for API Routes
// =============================================================================
// Provides JWT signing/verification and password hashing for the Next.js
// serverless API routes that connect directly to MongoDB.
// =============================================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { connectDB } from './mongodb';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'vriksham-jwt-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const BCRYPT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// Token Types
// ---------------------------------------------------------------------------

interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

// ---------------------------------------------------------------------------
// JWT Functions
// ---------------------------------------------------------------------------

/**
 * Signs an access token with the given userId and role.
 */
export function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Signs a refresh token with a longer expiry.
 */
export function signRefreshToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verifies a JWT and returns the payload, or null if invalid/expired.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extracts the Bearer token from an Authorization header, verifies it,
 * and returns the full user document (without password) from MongoDB.
 * Returns null if no valid token or user not found.
 */
export async function getAuthUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    await connectDB();

    const User = mongoose.models.User;
    if (!User) return null;

    const user = await User.findById(payload.userId).select('-password -refreshTokens -__v');
    return user;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Password Functions
// ---------------------------------------------------------------------------

/**
 * Hashes a plaintext password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password against a bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type { TokenPayload };
