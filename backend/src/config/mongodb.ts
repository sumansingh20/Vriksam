import mongoose from 'mongoose';
import config from './index';

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 2000;

let isConnected = false;

/**
 * Connect to MongoDB with retry logic and event listeners.
 * Uses MONGODB_URI from environment (via config) with fallback to local.
 */
export async function connectMongoDB(): Promise<typeof mongoose> {
  const uri = config.mongodb.uri;
  let lastError: Error | null = null;

  // Set up connection event listeners (only once)
  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('[MongoDB] Connected successfully');
  });

  mongoose.connection.on('error', (err: Error) => {
    isConnected = false;
    console.error('[MongoDB] Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB] Disconnected');
  });

  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[MongoDB] Connection attempt ${attempt}/${MAX_RETRIES}...`);

      const conn = await mongoose.connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
      });

      console.log(`[MongoDB] Connected to: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `[MongoDB] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`,
      );

      if (attempt < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`[MongoDB] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `[MongoDB] Failed to connect after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`,
  );
}

/**
 * Gracefully disconnect from MongoDB.
 */
export async function disconnectMongoDB(): Promise<void> {
  if (!isConnected && mongoose.connection.readyState === 0) {
    console.log('[MongoDB] Already disconnected');
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] Gracefully disconnected');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[MongoDB] Error during disconnect:', message);
    throw error;
  }
}

/**
 * Check if MongoDB is currently connected.
 */
export function isMongoDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  await disconnectMongoDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectMongoDB();
  process.exit(0);
});
