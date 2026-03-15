import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

// JWT payload shape
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Authenticated user attached to req.user
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

// Extend Express Request with user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Authenticate requests by verifying the JWT Bearer token.
 * On success, attaches the user object to req.user.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.',
      });
      return;
    }

    const token = authHeader.substring(7);

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          error: 'Token has expired. Please refresh your token.',
        });
        return;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          error: 'Invalid token. Please log in again.',
        });
        return;
      }
      res.status(401).json({
        success: false,
        error: 'Token verification failed.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: 'Account has been deactivated. Please contact support.',
      });
      return;
    }

    req.user = user as AuthenticatedUser;
    next();
  } catch (_error) {
    res.status(500).json({
      success: false,
      error: 'Internal authentication error.',
    });
  }
};

/**
 * Authorization middleware factory.
 * Restricts access to users whose role is in the provided whitelist.
 *
 * Usage: router.get('/admin', authenticate, authorize('ADMIN'), handler)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Required role(s): ${roles.join(', ')}.`,
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware.
 * Attaches user to req.user if a valid token is present, but does not
 * block the request if no token or an invalid token is provided.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = user as AuthenticatedUser;
      }
    }
  } catch {
    // Silently ignore invalid tokens for optional auth
  }

  next();
};

/**
 * Helper to generate a JWT access token for a user.
 */
export function generateAccessToken(user: { id: string; email: string; role: UserRole }): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
}

/**
 * Helper to generate a JWT refresh token for a user.
 */
export function generateRefreshToken(user: { id: string; email: string; role: UserRole }): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
}

/**
 * Verify a refresh token and return its payload.
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
}
