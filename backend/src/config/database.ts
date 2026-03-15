import { PrismaClient } from '@prisma/client';
import config from './index';

const LOG_LEVELS: Array<'query' | 'info' | 'warn' | 'error'> = config.app.isDevelopment
  ? ['query', 'info', 'warn', 'error']
  : ['warn', 'error'];

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: LOG_LEVELS.map((level) => ({
      emit: 'event' as const,
      level,
    })),
  });

  if (config.app.isDevelopment) {
    client.$on('query' as never, (e: { query: string; params: string; duration: number }) => {
      console.log(`[Prisma Query] ${e.query}`);
      console.log(`[Prisma Params] ${e.params}`);
      console.log(`[Prisma Duration] ${e.duration}ms`);
    });
  }

  client.$on('warn' as never, (e: { message: string }) => {
    console.warn(`[Prisma Warning] ${e.message}`);
  });

  client.$on('error' as never, (e: { message: string }) => {
    console.error(`[Prisma Error] ${e.message}`);
  });

  return client;
}

// Singleton: reuse in development to avoid exhausting database connections during hot reloads
const prisma: PrismaClient = global.__prisma ?? createPrismaClient();

if (config.app.isDevelopment) {
  global.__prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('[Database] Connected to PostgreSQL successfully');
  } catch (error) {
    console.error('[Database] Failed to connect:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('[Database] Disconnected from PostgreSQL');
}

export default prisma;
