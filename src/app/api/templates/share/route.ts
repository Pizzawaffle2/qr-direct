// File: src/app/api/templates/share/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { templateId, isPublic } = await req.json();

    // Verify ownership
    const existingTemplate = await prisma.template.findFirst({
      where: {
        id: templateId,
        userId: session.user.id,
      },
    });

    if (!existingTemplate) {
      return new Response('Template not found', { status: 404 });
    }

    const template = await prisma.template.update({
      where: { id: templateId },
      data: { isPublic },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to update template sharing:', error);
    return new Response('Failed to update template sharing', { status: 500 });
  }
}
