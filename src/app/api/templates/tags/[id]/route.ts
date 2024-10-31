import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { name } = await req.json();

    // Verify ownership
    const existingTag = await prisma.tag.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingTag) {
      return new Response('Tag not found', { status: 404 });
    }

    // Check for duplicate name
    const duplicateTag = await prisma.tag.findFirst({
      where: {
        name,
        userId: session.user.id,
        NOT: {
          id: params.id,
        },
      },
    });

    if (duplicateTag) {
      return new Response('Tag name already exists', { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: { name },
    });

    return NextResponse.json(tag);
  } catch (error) {
    return new Response('Failed to update tag', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Verify ownership
    const existingTag = await prisma.tag.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingTag) {
      return new Response('Tag not found', { status: 404 });
    }

    await prisma.tag.delete({
      where: { id: params.id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response('Failed to delete tag', { status: 500 });
  }
}