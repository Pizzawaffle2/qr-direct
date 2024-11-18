// services/userService.ts
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with ID ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      if (error.code === 'P2023') {
        throw new Error('Invalid ID format');
      }
      // Log the error for monitoring
      console.error('Database error:', error);
    }
    // Re-throw the error for handling upstream
    throw error;
  }
};

// Optional: Add a method to get user with specific fields
export const getUserWithFields = async (
  id: string,
  select: Prisma.UserSelect
): Promise<Partial<User> | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select
    });
  } catch (error) {
    console.error('Error fetching user with fields:', error);
    throw error;
  }
};
