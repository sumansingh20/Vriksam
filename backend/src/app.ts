import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';

import config from './config';
import { apiLimiter } from './middleware/rateLimiter';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

/**
 * Create and configure the Express application with all middleware.
 */
export function createApp(): Express {
  const app = express();

  // ---------------------------------------------------------------------------
  // Security headers
  // ---------------------------------------------------------------------------
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: config.app.isProduction ? undefined : false,
    })
  );

  // ---------------------------------------------------------------------------
  // CORS
  // ---------------------------------------------------------------------------
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) {
          callback(null, true);
          return;
        }
        if (config.cors.origins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
      maxAge: 86400, // 24 hours
    })
  );

  // ---------------------------------------------------------------------------
  // Compression
  // ---------------------------------------------------------------------------
  app.use(
    compression({
      level: 6,
      threshold: 1024, // Only compress responses larger than 1KB
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  // ---------------------------------------------------------------------------
  // Request logging
  // ---------------------------------------------------------------------------
  if (config.app.isDevelopment) {
    app.use(morgan('dev'));
  } else {
    app.use(
      morgan('combined', {
        skip: (_req, res) => res.statusCode < 400,
      })
    );
  }

  // ---------------------------------------------------------------------------
  // Body parsing
  // ---------------------------------------------------------------------------
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ---------------------------------------------------------------------------
  // Static files (uploaded images)
  // ---------------------------------------------------------------------------
  app.use(
    '/uploads',
    express.static(path.resolve(__dirname, '..', config.upload.dir))
  );

  // ---------------------------------------------------------------------------
  // Trust proxy (when behind nginx / load balancer)
  // ---------------------------------------------------------------------------
  if (config.app.isProduction) {
    app.set('trust proxy', 1);
  }

  // ---------------------------------------------------------------------------
  // Rate limiting (applied to all API routes)
  // ---------------------------------------------------------------------------
  app.use(config.app.apiPrefix, apiLimiter);

  // ---------------------------------------------------------------------------
  // Health check (outside API prefix, no auth required)
  // ---------------------------------------------------------------------------
  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.app.env,
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // ---------------------------------------------------------------------------
  // API Routes
  // ---------------------------------------------------------------------------
  app.use(config.app.apiPrefix, apiRoutes);

  // ---------------------------------------------------------------------------
  // 404 handler (must come after all routes)
  // ---------------------------------------------------------------------------
  app.use(notFoundHandler);

  // ---------------------------------------------------------------------------
  // Global error handler (must be the last middleware)
  // ---------------------------------------------------------------------------
  app.use(errorHandler);

  return app;
}

export default createApp;
