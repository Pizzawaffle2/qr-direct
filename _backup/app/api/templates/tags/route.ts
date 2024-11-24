import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    return new Response('Failed to fetch tags', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { name } = await req.json();

    // Check for existing tag
    const existingTag = await prisma.tag.findFirst({
      where: {
        name,
        userId: session.user.id,
      },
    });

    if (existingTag) {
      return new Response('Tag already exists', { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    return new Response('Failed to create tag', { status: 500 });
  }
}
