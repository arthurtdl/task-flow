import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// Global variable to hold the Prisma client instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Config needed for Prisma 7
const createPrismaClient = () => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

// If the Prisma client instance already exists, use it. Otherwise, create a new one
export const prisma = globalForPrisma.prisma || createPrismaClient();

// Save the instance in the global scope in development environment
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

prisma
  .$connect()
  .then(() => {
    console.log('✅ Successfully connected with database!');
  })
  .catch((error: Error) => {
    console.log('❌ Error connecting to database', error);
  });

export default prisma;