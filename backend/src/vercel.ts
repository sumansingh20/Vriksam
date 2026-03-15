// Vercel serverless handler - lazy initialization pattern
// All imports are deferred to catch module-level errors gracefully

let app: any = null;
let dbPromise: Promise<void> | null = null;

async function getApp() {
  if (app) return app;

  try {
    // Connect to MongoDB first
    const mongoModule = await import('./config/mongodb');
    if (!mongoModule.isMongoDBConnected()) {
      if (!dbPromise) {
        dbPromise = mongoModule.connectMongoDB()
          .then(() => console.log('[Vercel] MongoDB connected'))
          .catch((err) => {
            console.error('[Vercel] MongoDB error:', err.message);
            dbPromise = null;
            throw err;
          });
      }
      await dbPromise;
    }

    // Create Express app after DB is connected
    const appModule = await import('./app');
    app = appModule.createApp();
    console.log('[Vercel] Express app initialized');
    return app;
  } catch (err: any) {
    console.error('[Vercel] Initialization failed:', err.message);
    console.error('[Vercel] Stack:', err.stack);
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (err: any) {
    console.error('[Vercel] Request handler error:', err.message);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: 'Service initialization failed',
        detail: process.env.NODE_ENV !== 'production' ? err.message : undefined,
      }));
    }
  }
}
