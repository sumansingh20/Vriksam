// =============================================================================
// VRIKSHAM Frontend - MongoDB Connection Utility (Serverless)
// =============================================================================
// Cached connection for Vercel serverless functions.
// Prevents creating multiple connections across hot-reloaded invocations.
// =============================================================================

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vriksham';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a global variable so the connection is cached across hot reloads in dev
let cached: MongooseCache = (global as Record<string, unknown>).mongoose as MongooseCache;

if (!cached) {
  cached = (global as Record<string, unknown>).mongoose = { conn: null, promise: null } as MongooseCache;
}

/**
 * Connects to MongoDB (or returns the existing cached connection).
 * Safe for serverless environments where each invocation may spin up fresh.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
