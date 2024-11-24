// File: src/app/api/auth/verify-email/route.ts
import {prisma } from '@/lib/prisma';
import {createHash, randomBytes } from 'crypto';
import {emailService } from '@/services/email-service';
import {NextResponse } from 'next/server';
import {verify } from 'jsonwebtoken';

const verifyToken = async (token: string) => {
  try {
    return verify(token, process.env.JWT_SECRET!) as { email: string };
  } catch (_error) {
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Generate verification token
    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Store token in VerificationToken table
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await emailService.sendVerificationEmail(email, token);

    return new Response(JSON.stringify({ message: 'Verification email sent' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send verification email' }), {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400,
      });
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Find valid token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 400,
      });
    }

    // Update user as verified
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return new Response(JSON.stringify({ message: 'Email verified successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return new Response(JSON.stringify({ error: 'Failed to verify email' }), {
      status: 500,
    });
  }
}
export async function PUT(req: Request) {
  try {
    // Extract token from request body
    const { token } = await req.json();

    // Validate token exists
    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify the token
    const payload = await verifyToken(token);
    if (!payload?.email) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Find user and verify email hasn't already been verified
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true, emailVerified: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date()
      }
    });

    return NextResponse.json({
      message: "Email verified successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Email verification error:", error);
    
    return NextResponse.json({
      error: "Failed to verify email"
    }, { status: 500 });
  }
}
