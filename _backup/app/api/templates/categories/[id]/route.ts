// File: src/app/api/templates/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { name, description, color } = await req.json();

    // Verify ownership
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingCategory) {
      return new Response('Category not found', { status: 404 });
    }

    // Check for duplicate name
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: session.user.id,
        NOT: {
          id: params.id,
        },
      },
    });

    if (duplicateCategory) {
      return new Response('Category name already exists', { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        description,
        color,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return new Response('Failed to update category', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Verify ownership
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingCategory) {
      return new Response('Category not found', { status: 404 });
    }

    // Get templates using this category
    const templatesWithCategory = await prisma.template.findMany({
      where: {
        categoryId: params.id,
      },
    });

    // Start a transaction to handle category deletion
    await prisma.$transaction(async (tx) => {
      // Update templates to remove the category reference
      if (templatesWithCategory.length > 0) {
        await tx.template.updateMany({
          where: {
            categoryId: params.id,
          },
          data: {
            categoryId: null,
          },
        });
      }

      // Delete the category
      await tx.category.delete({
        where: { id: params.id },
      });
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete category error:', error);
    return new Response('Failed to delete category', { status: 500 });
  }
}
