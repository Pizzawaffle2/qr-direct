// scripts/db/reset.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reset() {
  try {
    console.log('🗑️ Starting database reset...');

    // Delete all records from all tables
    const modelNames = Object.keys(prisma).filter(
      (key) => key[0] !== '_' && key[0] === key[0].toUpperCase()
    );

    for (const modelName of modelNames) {
      // @ts-ignore - Dynamic model access
      await prisma[modelName].deleteMany({});
      console.log(`✓ Cleared ${modelName}`);
    }

    console.log('✅ Database reset completed!');
  } catch (error) {
    console.error('❌ Error during reset:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
