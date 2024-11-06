
// src/lib/db/utils.ts
import { PrismaClient } from '@prisma/client'

export async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

export async function cleanDatabase() {
  const prisma = new PrismaClient()
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot clean database in production')
  }

  try {
    await prisma.$transaction([
      prisma.qRCode.deleteMany(),
      prisma.category.deleteMany(),
      prisma.template.deleteMany(),
      prisma.tag.deleteMany(),
    ])
    
    console.log('Database cleaned successfully')
  } catch (error) {
    console.error('Database clean error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}