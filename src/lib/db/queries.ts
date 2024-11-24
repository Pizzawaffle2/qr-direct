// src/lib/db/queries.ts
import {prisma } from '.';
import {Prisma } from '@prisma/client';

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      settings: true,
    },
  });
}

export async function getQRCodesByUserId(userId: string) {
  return await prisma.qRCode.findMany({
    where: { userId },
    orderBy: { created: 'desc' },
    include: {
      category: true,
      tags: true,
    },
  });
}

export async function createQRCode(data: Prisma.QRCodeCreateInput) {
  return await prisma.qRCode.create({
    data,
    include: {
      category: true,
      tags: true,
    },
  });
}
