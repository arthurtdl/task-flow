import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// These are necessary because of Prisma 7
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

prisma
  .$connect()
  .then(() => {
    console.log('✅ Successfully connected with database!');
  })
  .catch((error: Error) => {
    console.log('❌ Error connecting to database', error);
  });

export default prisma;