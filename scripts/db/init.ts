// scripts/db/init.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database initialization...');

    // Create default admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@qrdirect.com' },
      update: {},
      create: {
        email: 'admin@qrdirect.com',
        name: 'Admin User',
        subscriptionStatus: 'active',
        subscriptionTier: 'pro',
        password: await hash('admin123', 12), // Change this in production
        settings: {
          create: {
            theme: 'system',
            defaultBackgroundColor: '#FFFFFF',
            defaultForegroundColor: '#000000',
            errorCorrectionLevel: 'M',
            autoDownload: false,
            historyLimit: 50,
            emailNotifications: true,
          },
        },
      },
    });

    // Create default categories
    const categories = [
      { name: 'Business', color: '#2563eb' },
      { name: 'Personal', color: '#16a34a' },
      { name: 'Marketing', color: '#dc2626' },
      { name: 'Education', color: '#9333ea' },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: {
          name_userId: {
            name: category.name,
            userId: adminUser.id,
          },
        },
        update: {},
        create: {
          name: category.name,
          color: category.color,
          userId: adminUser.id,
        },
      });
    }

    // Create default tags
    const tags = ['Important', 'Work', 'Personal', 'Temporary'];

    for (const tagName of tags) {
      await prisma.tag.upsert({
        where: {
          name_userId: {
            name: tagName,
            userId: adminUser.id,
          },
        },
        update: {},
        create: {
          name: tagName,
          userId: adminUser.id,
        },
      });
    }

    // Create default templates
    const defaultTemplates = [
      {
        name: 'Basic',
        description: 'Simple and clean QR code template',
        style: {
          backgroundColor: '#FFFFFF',
          foregroundColor: '#000000',
          errorCorrectionLevel: 'M',
          margin: 4,
        },
        isPublic: true,
      },
      {
        name: 'Business Card',
        description: 'Professional template for business cards',
        style: {
          backgroundColor: '#F8FAFC',
          foregroundColor: '#1E293B',
          errorCorrectionLevel: 'H',
          margin: 2,
        },
        isPublic: true,
      },
    ];

    for (const template of defaultTemplates) {
      await prisma.template.upsert({
        where: {
          id: template.name.toLowerCase(),
        },
        update: {},
        create: {
          id: template.name.toLowerCase(),
          ...template,
          userId: adminUser.id,
        },
      });
    }

    // Create API key for admin
    await prisma.aPIKey.upsert({
      where: {
        key: 'qrd_default_key',
      },
      update: {},
      create: {
        name: 'Default API Key',
        key: 'qrd_default_key',
        userId: adminUser.id,
      },
    });

    console.log('✅ Database initialization completed!');
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
