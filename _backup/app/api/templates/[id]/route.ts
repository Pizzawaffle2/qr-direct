// File: src/app/api/templates/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { UpdateTemplateDTO } from '@/lib/types/qr-styles';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const template = await prisma.template.findFirst({
      where: {
        id: params.id,
        OR: [{ userId: session.user.id }, { isPublic: true }],
      },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!template) {
      return new Response('Template not found', { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return new Response('Failed to fetch template', { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Verify ownership
    const existingTemplate = await prisma.template.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingTemplate) {
      return new Response('Template not found', { status: 404 });
    }

    const data: UpdateTemplateDTO = await req.json();

    // Update template
    const template = await prisma.template.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        style: data.style,
        preview: data.preview,
        categoryId: data.categoryId,
        isPublic: data.isPublic,
        ...(data.tagIds && {
          tags: {
            set: data.tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to update template:', error);
    return new Response('Failed to update template', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Verify ownership
    const existingTemplate = await prisma.template.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingTemplate) {
      return new Response('Template not found', { status: 404 });
    }

    await prisma.template.delete({
      where: { id: params.id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete template:', error);
    return new Response('Failed to delete template', { status: 500 });
  }
}
