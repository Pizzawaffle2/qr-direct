// File: src/app/api/auth/forgot-password/route.ts
import {NextResponse } from 'next/server';
import {prisma } from '@/lib/prisma';
import {emailService } from '@/services/email-service';
import {generateToken, hashToken, generateExpiryDate } from '@/lib/utils/tokens';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = generateToken();
      const hashedToken = hashToken(resetToken);
      const expires = generateExpiryDate(1); // 1 hour

      await prisma.passwordResetToken.upsert({
        where: { userId: user.id },
        update: {
          token: hashedToken,
          expires,
        },
        create: {
          userId: user.id,
          token: hashedToken,
          expires,
        },
      });

      await emailService.sendPasswordResetEmail(email, resetToken);
    }

    return NextResponse.json({
      message: 'If an account exists, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
