// File: src/app/api/user/notifications/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  try {
    const { id, enabled } = await req.json();
    await prisma.notificationSetting.upsert({
      where: {
        userId_settingId: {
          userId: session.user.id,
          settingId: id,
        },
      },
      update: { enabled },
      create: {
        userId: session.user.id,
        settingId: id,
        enabled,
      },
    });
    return NextResponse.json({ message: 'Preferences updated' });
  } catch (error) {
    return new Response('Failed to update preferences', { status: 500 });
  }
}
