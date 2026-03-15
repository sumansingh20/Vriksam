// =============================================================================
// VRIKSHAM - Redis Caching Service
// =============================================================================
// Provides a Redis client with caching utilities, cache-aside pattern,
// pattern-based invalidation, and graceful degradation when Redis is unavailable.
// =============================================================================

import Redis from 'ioredis';
import config from '../config';

// -----------------------------------------------------------------------------
// Cache Key Constants
// -----------------------------------------------------------------------------

export const CACHE_KEYS = {
  // Plant keys
  PLANT_LIST: 'plants:list',
  PLANT_DETAIL: (id: string) => `plants:detail:${id}`,
  PLANT_HEALTH: (id: string) => `plants:health:${id}`,

  // Client keys
  CLIENT_LIST: 'clients:list',
  CLIENT_DETAIL: (id: string) => `clients:detail:${id}`,

  // Technician keys
  TECHNICIAN_LIST: 'technicians:list',
  TECHNICIAN_DETAIL: (id: string) => `technicians:detail:${id}`,

  // Service visit keys
  VISIT_LIST: 'visits:list',
  VISIT_DETAIL: (id: string) => `visits:detail:${id}`,

  // Subscription keys
  SUBSCRIPTION_LIST: 'subscriptions:list',
  SUBSCRIPTION_DETAIL: (id: string) => `subscriptions:detail:${id}`,

  // Invoice & payment keys
  INVOICE_LIST: 'invoices:list',
  INVOICE_DETAIL: (id: string) => `invoices:detail:${id}`,
  PAYMENT_LIST: 'payments:list',

  // Inventory keys
  INVENTORY_LIST: 'inventory:list',
  INVENTORY_DETAIL: (id: string) => `inventory:detail:${id}`,

  // Dashboard & analytics keys
  DASHBOARD_STATS: 'dashboard:stats',
  DASHBOARD_ADMIN: 'dashboard:admin',
  DASHBOARD_CLIENT: (id: string) => `dashboard:client:${id}`,
  ANALYTICS_OVERVIEW: 'analytics:overview',
  ANALYTICS_PLANTS: 'analytics:plants',
  ANALYTICS_REVENUE: 'analytics:revenue',

  // Notification keys
  NOTIFICATION_UNREAD: (userId: string) => `notifications:unread:${userId}`,

  // WebSocket presence
  WS_ONLINE_USERS: 'ws:online_users',
} as const;

// -----------------------------------------------------------------------------
// Default TTLs (in seconds)
// -----------------------------------------------------------------------------

export const CACHE_TTL = {
  LIST: 300,           // 5 minutes
  DETAIL: 600,         // 10 minutes
  ANALYTICS: 900,      // 15 minutes
  DASHBOARD: 120,      // 2 minutes
  SHORT: 60,           // 1 minute
  LONG: 1800,          // 30 minutes
} as const;

// -----------------------------------------------------------------------------
// Redis Service Class
// -----------------------------------------------------------------------------

class RedisService {
  private client: Redis | null = null;
  private isAvailable = false;

  constructor() {
    this.connect();
  }

  // ---------------------------------------------------------------------------
  // Connection
  // ---------------------------------------------------------------------------

  private connect(): void {
    try {
      const redisUrl =
        (config as Record<string, unknown>).redis &&
        typeof (config as Record<string, unknown>).redis === 'object' &&
        ((config as Record<string, unknown>).redis as Record<string, string>).url
          ? ((config as Record<string, unknown>).redis as Record<string, string>).url
          : process.env.REDIS_URL || 'redis://localhost:6379';

      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times: number) {
          if (times > 5) {
            console.warn('[Redis] Max reconnection attempts reached. Giving up.');
            return null; // Stop retrying
          }
          const delay = Math.min(times * 200, 5000);
          return delay;
        },
        lazyConnect: false,
        enableOfflineQueue: true,
        connectTimeout: 10000,
      });

      this.client.on('connect', () => {
        this.isAvailable = true;
        console.log('[Redis] Connected successfully');
      });

      this.client.on('ready', () => {
        this.isAvailable = true;
        console.log('[Redis] Ready to accept commands');
      });

      this.client.on('error', (err: Error) => {
        this.isAvailable = false;
        console.error('[Redis] Connection error:', err.message);
      });

      this.client.on('close', () => {
        this.isAvailable = false;
        console.warn('[Redis] Connection closed');
      });

      this.client.on('reconnecting', () => {
        console.log('[Redis] Attempting to reconnect...');
      });
    } catch (error) {
      this.isAvailable = false;
      console.error('[Redis] Failed to initialize:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // Health Check
  // ---------------------------------------------------------------------------

  isConnected(): boolean {
    return this.isAvailable && this.client !== null;
  }

  // ---------------------------------------------------------------------------
  // Core Operations
  // ---------------------------------------------------------------------------

  /**
   * Get a value from Redis and parse it as JSON.
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected()) return null;

    try {
      const data = await this.client!.get(key);
      if (data === null) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`[Redis] GET error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set a value in Redis with optional TTL.
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected()) return false;

    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client!.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client!.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error(`[Redis] SET error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Delete a key from Redis.
   */
  async del(key: string): Promise<boolean> {
    if (!this.isConnected()) return false;

    try {
      await this.client!.del(key);
      return true;
    } catch (error) {
      console.error(`[Redis] DEL error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Delete all keys matching a glob pattern using SCAN (non-blocking).
   */
  async delPattern(pattern: string): Promise<number> {
    if (!this.isConnected()) return 0;

    try {
      let cursor = '0';
      let deletedCount = 0;

      do {
        const [nextCursor, keys] = await this.client!.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.client!.del(...keys);
          deletedCount += keys.length;
        }
      } while (cursor !== '0');

      return deletedCount;
    } catch (error) {
      console.error(`[Redis] DEL_PATTERN error for "${pattern}":`, error);
      return 0;
    }
  }

  /**
   * Check if a key exists in Redis.
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected()) return false;

    try {
      const result = await this.client!.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`[Redis] EXISTS error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Atomically increment a key's integer value.
   */
  async increment(key: string): Promise<number | null> {
    if (!this.isConnected()) return null;

    try {
      const result = await this.client!.incr(key);
      return result;
    } catch (error) {
      console.error(`[Redis] INCR error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set expiry (TTL) on an existing key.
   */
  async setExpiry(key: string, seconds: number): Promise<boolean> {
    if (!this.isConnected()) return false;

    try {
      await this.client!.expire(key, seconds);
      return true;
    } catch (error) {
      console.error(`[Redis] EXPIRE error for key "${key}":`, error);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Cache-Aside Pattern
  // ---------------------------------------------------------------------------

  /**
   * Get a value from cache, or fetch it using the provided function and cache the result.
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = CACHE_TTL.LIST
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const freshData = await fetcher();

    // Cache the result (non-blocking)
    this.set(key, freshData, ttlSeconds).catch(() => {
      // Silently ignore cache write failures
    });

    return freshData;
  }

  // ---------------------------------------------------------------------------
  // Cache Invalidation
  // ---------------------------------------------------------------------------

  /**
   * Invalidate all cache keys that start with the given tag prefixes.
   * For example: invalidateCache(['plants:', 'dashboard:']) will delete
   * all keys beginning with "plants:" or "dashboard:".
   */
  async invalidateCache(tags: string[]): Promise<void> {
    if (!this.isConnected()) return;

    try {
      const deletePromises = tags.map((tag) => this.delPattern(`${tag}*`));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('[Redis] Cache invalidation error:', error);
    }
  }

  /**
   * Flush all keys from the current Redis database.
   * Use with extreme caution -- intended for admin operations only.
   */
  async flushAll(): Promise<boolean> {
    if (!this.isConnected()) return false;

    try {
      await this.client!.flushdb();
      console.log('[Redis] Database flushed');
      return true;
    } catch (error) {
      console.error('[Redis] FLUSHDB error:', error);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Graceful Shutdown
  // ---------------------------------------------------------------------------

  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        this.isAvailable = false;
        console.log('[Redis] Disconnected gracefully');
      } catch (error) {
        console.error('[Redis] Error during disconnect:', error);
        this.client.disconnect();
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Export Singleton
// -----------------------------------------------------------------------------

const redisService = new RedisService();
export default redisService;
