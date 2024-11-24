// src/app/api/auth/register/route.ts
import {hash } from 'bcryptjs';
import {prisma } from '@/lib/prisma';
import {NextResponse } from 'next/server';
import {z } from 'zod';
import {USER_ROLE, SUBSCRIPTION_STATUS, SUBSCRIPTION_TIER } from '@/constants/user';
import {generateUsername } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().optional(),
  bio: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = registerSchema.parse(json);

    // Check if email already exists
    const emailExists = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (emailExists) {
      return new NextResponse('Email already exists', { status: 400 });
    }

    // Generate unique username if not provided
    let username = body.username;
    if (!username) {
      username = await generateUsername(body.name);
    } else {
      // Check if username exists
      const usernameExists = await prisma.user.findUnique({
        where: { username },
      });
      if (usernameExists) {
        return new NextResponse('Username already exists', { status: 400 });
      }
    }

    const hashedPassword = await hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        username,
        bio: body.bio,
        role: USER_ROLE.USER,
        subscriptionStatus: SUBSCRIPTION_STATUS.INACTIVE,
        subscriptionTier: SUBSCRIPTION_TIER.FREE,
        failedLoginAttempts: 0,
        settings: {
          create: {
            theme: 'system',
            emailNotifications: true,
          },
        },
        usage: {
          create: {
            period: new Date(),
            qrCodes: 0,
            scansReceived: 0,
          },
        },
      },
      include: {
        settings: true,
        usage: true,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    console.error('Registration error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
