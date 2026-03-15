import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import config from '../config';

/**
 * Default API rate limiter.
 * Applies to all routes under the API prefix.
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For if behind a reverse proxy, otherwise use the IP
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || 'unknown';
  },
  skip: (_req) => {
    // Skip rate limiting in test environment
    return config.app.isTest;
  },
});

/**
 * Strict rate limiter for authentication endpoints.
 * Prevents brute-force login attempts.
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                    // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || 'unknown';
  },
  skip: (_req) => {
    return config.app.isTest;
  },
});

/**
 * Rate limiter for password reset endpoint.
 * Very strict to prevent email enumeration and abuse.
 */
export const passwordResetLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,                    // 3 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many password reset attempts. Please try again after 1 hour.',
    code: 'RESET_RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || 'unknown';
  },
  skip: (_req) => {
    return config.app.isTest;
  },
});

/**
 * Rate limiter for file upload endpoints.
 */
export const uploadLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,                   // 50 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Upload limit reached. Please try again later.',
    code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.ip
      || 'unknown';
  },
  skip: (_req) => {
    return config.app.isTest;
  },
});
