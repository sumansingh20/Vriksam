import { connectMongoDB, isMongoDBConnected } from './config/mongodb';
import { createApp } from './app';

const app = createApp();

// Ensure MongoDB is connected before handling requests
let dbPromise: Promise<void> | null = null;

function ensureDbConnected(): Promise<void> {
  if (isMongoDBConnected()) {
    return Promise.resolve();
  }
  if (!dbPromise) {
    dbPromise = connectMongoDB()
      .then(() => {
        console.log('[Vercel] MongoDB connected');
      })
      .catch((err) => {
        dbPromise = null;
        throw err;
      });
  }
  return dbPromise;
}

export default async function handler(req: any, res: any) {
  await ensureDbConnected();
  return app(req, res);
}
