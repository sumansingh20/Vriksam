import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvInt(key: string, fallback?: number): number {
  const raw = process.env[key];
  if (raw !== undefined) {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) {
      throw new Error(`Environment variable ${key} must be an integer, got: ${raw}`);
    }
    return parsed;
  }
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
}

function getEnvBool(_key: string, fallback?: boolean): boolean {
  const raw = process.env[_key];
  if (raw !== undefined) {
    return raw === 'true' || raw === '1';
  }
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${_key}`);
}

const nodeEnv = getEnv('NODE_ENV', 'development');

const config = {
  // Application
  app: {
    name: getEnv('APP_NAME', 'Vriksham'),
    env: nodeEnv,
    port: getEnvInt('PORT', 4000),
    apiPrefix: getEnv('API_PREFIX', '/api/v1'),
    url: getEnv('APP_URL', 'http://localhost:4000'),
    frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3000'),
    isProduction: nodeEnv === 'production',
    isDevelopment: nodeEnv === 'development',
    isTest: nodeEnv === 'test',
  },

  // Database
  database: {
    url: getEnv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/vriksham?schema=public'),
  },

  // JWT Authentication
  jwt: {
    secret: getEnv('JWT_SECRET', 'dev-secret-change-in-production'),
    expiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
    refreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  },

  // Google OAuth
  google: {
    clientId: getEnv('GOOGLE_CLIENT_ID', ''),
    clientSecret: getEnv('GOOGLE_CLIENT_SECRET', ''),
    callbackUrl: getEnv('GOOGLE_CALLBACK_URL', 'http://localhost:4000/api/v1/auth/google/callback'),
  },

  // Stripe Payments
  stripe: {
    secretKey: getEnv('STRIPE_SECRET_KEY', ''),
    publishableKey: getEnv('STRIPE_PUBLISHABLE_KEY', ''),
    webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET', ''),
  },

  // OpenAI
  openai: {
    apiKey: getEnv('OPENAI_API_KEY', ''),
    model: getEnv('OPENAI_MODEL', 'gpt-4o'),
    maxTokens: getEnvInt('OPENAI_MAX_TOKENS', 1024),
  },

  // AWS S3
  aws: {
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', ''),
    region: getEnv('AWS_REGION', 'ap-south-1'),
    s3Bucket: getEnv('AWS_S3_BUCKET', 'vriksham-uploads'),
  },

  // Email SMTP
  email: {
    host: getEnv('SMTP_HOST', 'smtp.gmail.com'),
    port: getEnvInt('SMTP_PORT', 587),
    user: getEnv('SMTP_USER', ''),
    pass: getEnv('SMTP_PASS', ''),
    from: getEnv('EMAIL_FROM', 'noreply@vriksham.com'),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: getEnvInt('RATE_LIMIT_WINDOW_MS', 900000),
    maxRequests: getEnvInt('RATE_LIMIT_MAX_REQUESTS', 100),
  },

  // Logging
  logging: {
    level: getEnv('LOG_LEVEL', 'debug'),
    dir: getEnv('LOG_DIR', 'logs'),
  },

  // CORS
  cors: {
    origins: getEnv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim()),
  },

  // MongoDB
  mongodb: {
    uri: getEnv('MONGODB_URI', 'mongodb://localhost:27017/vriksham'),
  },

  // Redis
  redis: {
    url: getEnv('REDIS_URL', 'redis://localhost:6379'),
    keyPrefix: getEnv('REDIS_KEY_PREFIX', 'vriksham:'),
  },

  // WebSocket
  ws: {
    path: getEnv('WS_PATH', '/ws'),
    heartbeatInterval: getEnvInt('WS_HEARTBEAT_INTERVAL', 30000),
  },

  // File Upload & Image Processing
  upload: {
    maxFileSize: getEnvInt('MAX_FILE_SIZE', 5242880),
    dir: getEnv('UPLOAD_DIR', 'uploads'),
    thumbnailWidth: getEnvInt('THUMBNAIL_WIDTH', 200),
    thumbnailHeight: getEnvInt('THUMBNAIL_HEIGHT', 200),
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ],
  },
} as const;

// Export getEnvBool for use in other modules that may need it
export { getEnv, getEnvInt, getEnvBool };
export type AppConfig = typeof config;
export default config;
