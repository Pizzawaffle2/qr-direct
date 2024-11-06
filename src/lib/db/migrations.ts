
// src/lib/db/migrations.ts
import { PrismaClient } from '@prisma/client'

export async function migrate() {
  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    console.log('Connected to database')

    // Add any necessary migrations here
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "QRCode_userId_idx" ON "QRCode" ("userId");
    `

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "QRCode_created_idx" ON "QRCode" ("created");
    `

    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}