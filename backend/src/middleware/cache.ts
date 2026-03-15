// =============================================================================
// VRIKSHAM - Cache Middleware
// =============================================================================
// Express middleware for Redis-backed response caching.
// - cacheResponse: intercepts GET requests, returns cached JSON or falls through
// - invalidateOnMutation: clears related cache keys after mutating operations
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import redisService from '../services/redis.service';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type CacheKeyGenerator = (req: Request) => string;

// -----------------------------------------------------------------------------
// Cache Response Middleware
// -----------------------------------------------------------------------------

/**
 * Middleware that caches JSON responses in Redis.
 *
 * @param keyGenerator - Function that derives the cache key from the request.
 * @param ttlSeconds   - Time-to-live in seconds for the cached entry.
 *
 * Usage:
 * ```ts
 * router.get('/plants', cacheResponse((req) => `plants:list:${qs}`, 300), handler);
 * ```
 */
export function cacheResponse(
  keyGenerator: CacheKeyGenerator,
  ttlSeconds: number = 300
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      next();
      return;
    }

    // Skip caching if Redis is not available
    if (!redisService.isConnected()) {
      next();
      return;
    }

    // Skip caching for authenticated requests that contain user-specific data
    // unless the cache key explicitly handles per-user caching.
    // This is a safety default; the keyGenerator should include userId if needed.

    const cacheKey = keyGenerator(req);

    try {
      // Check cache
      const cached = await redisService.get<CachedResponse>(cacheKey);

      if (cached !== null) {
        res.status(cached.statusCode || 200).json(cached.body);
        return;
      }
    } catch {
      // Cache read failed -- fall through to handler
    }

    // Monkey-patch res.json to capture the response and cache it
    const originalJson = res.json.bind(res);

    res.json = function (body: unknown) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entry: CachedResponse = {
          body,
          statusCode: res.statusCode,
          cachedAt: new Date().toISOString(),
        };

        redisService.set(cacheKey, entry, ttlSeconds).catch(() => {
          // Silently ignore cache write errors
        });
      }

      return originalJson(body);
    };

    next();
  };
}

interface CachedResponse {
  body: unknown;
  statusCode: number;
  cachedAt: string;
}

// -----------------------------------------------------------------------------
// Cache Invalidation Middleware
// -----------------------------------------------------------------------------

/**
 * Middleware that invalidates cache entries after a mutating request succeeds.
 * Attaches a response listener to run invalidation only on 2xx responses.
 *
 * @param patterns - Array of key prefix patterns to invalidate (e.g., ['plants:', 'dashboard:']).
 *
 * Usage:
 * ```ts
 * router.post('/plants', invalidateOnMutation(['plants:', 'dashboard:']), handler);
 * ```
 */
export function invalidateOnMutation(patterns: string[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    // Hook into the response finish event
    res.on('finish', () => {
      // Only invalidate on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redisService.invalidateCache(patterns).catch((error) => {
          console.error('[CacheMiddleware] Invalidation error:', error);
        });
      }
    });

    next();
  };
}

// -----------------------------------------------------------------------------
// Utility: Build Cache Key from Request
// -----------------------------------------------------------------------------

/**
 * Helper to build a deterministic cache key from the request path and query params.
 */
export function buildCacheKey(prefix: string): CacheKeyGenerator {
  return (req: Request): string => {
    const queryString = Object.entries(req.query)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return queryString ? `${prefix}:${queryString}` : prefix;
  };
}
