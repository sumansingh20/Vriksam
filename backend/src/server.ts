import { createApp } from './app';
import config from './config';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectMongoDB, disconnectMongoDB } from './config/mongodb';
import websocketService from './services/websocket.service';

// Capture unhandled errors early
process.on('uncaughtException', (error: Error) => {
  console.error('[FATAL] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[FATAL] Unhandled Promise Rejection:', reason);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  // Connect to database(s) based on DB_TYPE env variable
  // Options: 'mongodb' (default), 'prisma', 'both'
  const dbType = process.env.DB_TYPE || 'mongodb';

  if (dbType === 'prisma' || dbType === 'both') {
    await connectDatabase();
    console.log('[DB] Connected to PostgreSQL via Prisma');
  }

  if (dbType === 'mongodb' || dbType === 'both') {
    await connectMongoDB();
    console.log('[DB] Connected to MongoDB');
  }

  // Create the Express application
  const app = createApp();

  // Start listening
  const server = app.listen(config.app.port, () => {
    console.log('='.repeat(60));
    console.log(`  ${config.app.name} API Server`);
    console.log(`  Environment : ${config.app.env}`);
    console.log(`  Port        : ${config.app.port}`);
    console.log(`  API Prefix  : ${config.app.apiPrefix}`);
    console.log(`  URL         : ${config.app.url}`);
    console.log(`  WebSocket   : ${config.app.url}/ws`);
    console.log('='.repeat(60));
  });

  // Initialize WebSocket server
  websocketService.initialize(server);

  // Configure server timeouts
  server.keepAliveTimeout = 65000; // Slightly higher than typical ALB idle timeout of 60s
  server.headersTimeout = 66000;   // Slightly higher than keepAliveTimeout

  // -------------------------------------------------------------------
  // Graceful shutdown
  // -------------------------------------------------------------------
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

  for (const signal of signals) {
    process.on(signal, () => {
      console.log(`\n[Shutdown] Received ${signal}. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        console.log('[Shutdown] HTTP server closed.');

        try {
          // Shut down WebSocket server
          websocketService.shutdown();
          console.log('[Shutdown] WebSocket server closed.');

          // Disconnect from databases
          await disconnectMongoDB();
          await disconnectDatabase().catch(() => {});
          console.log('[Shutdown] Database connections closed.');
        } catch (error) {
          console.error('[Shutdown] Error during database disconnect:', error);
        }

        console.log('[Shutdown] Graceful shutdown complete.');
        process.exit(0);
      });

      // Force shutdown after 30 seconds if graceful shutdown hangs
      setTimeout(() => {
        console.error('[Shutdown] Forced shutdown after 30s timeout.');
        process.exit(1);
      }, 30000).unref();
    });
  }
}

bootstrap().catch((error) => {
  console.error('[FATAL] Failed to start server:', error);
  process.exit(1);
});
