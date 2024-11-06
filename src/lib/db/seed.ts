
// src/lib/db/seed.ts
import { PrismaClient } from '@prisma/client'

async function seed() {
  const prisma = new PrismaClient()

  try {
    // Add default categories
    await prisma.category.createMany({
      data: [
        { name: 'Business', description: 'Business related QR codes' },
        { name: 'Personal', description: 'Personal QR codes' },
        { name: 'Marketing', description: 'Marketing campaign QR codes' },
      ],
      skipDuplicates: true,
    })

    // Add default templates
    await prisma.template.createMany({
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
    })

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Seed error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}