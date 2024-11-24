// File: src/app/api/user/api-keys/route.ts
import {NextResponse } from 'next/server';
import {getServerSession } from 'next-auth/next';
import {authOptions } from '@/lib/auth';
import {prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  try {
    const { name } = await req.json();
    const key = `qr_${crypto.randomBytes(32).toString('hex')}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
        userId: session.user.id,
      },
    });

    return NextResponse.json(apiKey);
  } catch (_error) {
    return new Response('Failed to create API key', { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(apiKeys);
  } catch (_error) {
    return new Response('Failed to fetch API keys', { status: 500 });
  }
}
