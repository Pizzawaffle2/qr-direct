// File: src/app/api/templates/route.ts
import {NextResponse } from 'next/server';
import {prisma } from '@/lib/prisma';
import {getServerSession } from 'next-auth';
import {authOptions } from '@/lib/auth';
import type { CreateTemplateDTO } from '@/lib/types/qr-styles';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const templates = await prisma.template.findMany({
      where: {
        userId: session.user.id,
        ...(categoryId && { categoryId }),
        ...(tag && {
          tags: {
            some: {
              name: {
                contains: tag,
                mode: 'insensitive',
              },
            },
          },
        }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return new Response('Failed to fetch templates', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const data: CreateTemplateDTO = await req.json();

    const template = await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        style: data.style,
        preview: data.preview,
        categoryId: data.categoryId,
        isPublic: data.isPublic ?? false,
        userId: session.user.id,
        tags: {
          connect: data.tagIds?.map((id) => ({ id })) || [],
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to create template:', error);
    return new Response('Failed to create template', { status: 500 });
  }
}
