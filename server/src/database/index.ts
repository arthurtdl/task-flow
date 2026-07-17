import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

prisma
.$connect()
.then(() => {
    console.log('✅ Database successfully connected');
})
.catch((error: Error) => {
    console.error('❌ Database connection error:', error);
    process.exit(1);
});

export default prisma;