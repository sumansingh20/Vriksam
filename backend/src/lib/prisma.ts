import { PrismaClient } from '@prisma/client';
import config from '../config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.app.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });

if (!config.app.isProduction) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
