// scripts/db/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create test users
    const users = [
      {
        email: 'test@qrdirect.com',
        name: 'Test User',
        password: await hash('test123', 12),
        subscriptionTier: 'free'
      },
      {
        email: 'pro@qrdirect.com',
        name: 'Pro User',
        password: await hash('pro123', 12),
        subscriptionTier: 'pro'
      }
    ]

    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          settings: {
            create: {
              theme: 'system',
              defaultBackgroundColor: '#FFFFFF',
              defaultForegroundColor: '#000000',
              errorCorrectionLevel: 'M',
              autoDownload: false,
              historyLimit: 50,
              emailNotifications: true
            }
          }
        }
      })

      // Create some QR codes for each user
      await prisma.qRCode.create({
        data: {
          title: 'Test QR Code',
          type: 'url',
          content: { url: 'https://example.com' },
          userId: user.id
        }
      })
    }

    console.log('✅ Database seeding completed!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()