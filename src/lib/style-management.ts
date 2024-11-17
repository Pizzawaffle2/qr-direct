// src/lib/style-management.ts

import { QRStyleOptions } from "@/types/qr"
import { prisma } from "@/lib/db"

export interface SavedStyle {
  id: string
  name: string
  style: QRStyleOptions
  userId: string
  createdAt: Date
  updatedAt: Date
}

export async function saveStyle(
  name: string,
  style: QRStyleOptions,
  userId: string
): Promise<SavedStyle> {
  return await prisma.qRStyle.create({
    data: {
      name,
      style: style as any,
      userId,
    },
  })
}

export async function getSavedStyles(userId: string): Promise<SavedStyle[]> {
  return await prisma.qRStyle.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function deleteStyle(id: string, userId: string): Promise<void> {
  await prisma.qRStyle.delete({
    where: {
      id_userId: {
        id,
        userId,
      },
    },
  })
}