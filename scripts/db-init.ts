// scripts/db-init.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database initialization...');

  try {
    // Test connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Create default categories
    const categories = await prisma.category.createMany({
      data: [
        { name: 'Business', description: 'Business related QR codes' },
        { name: 'Personal', description: 'Personal QR codes' },
        { name: 'Marketing', description: 'Marketing campaign QR codes' },
      ],
      skipDuplicates: true,
    });
    console.log('Created default categories');

    // Create default templates
    const templates = await prisma.template.createMany({
      data: [
        {
          name: 'Basic URL',
          description: 'Simple URL QR code template',
          style: {
            size: 300,
            margin: 4,
            foregroundColor: '#000000',
            backgroundColor: '#FFFFFF',
          },
          isPublic: true,
        },
        {
          name: 'Business Card',
          description: 'Professional vCard QR code template',
          style: {
            size: 400,
            margin: 6,
            foregroundColor: '#1a365d',
            backgroundColor: '#ffffff',
          },
          isPublic: true,
        },
      ],
      skipDuplicates: true,
    });
    console.log('Created default templates');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
