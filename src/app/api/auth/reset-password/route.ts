// File: src/app/api/auth/reset-password/route.ts
import {NextResponse } from 'next/server';
import {prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {z } from 'zod';
import {hashToken } from '@/lib/utils/tokens';

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export async function POST(req: Request) {
  try {
    const { token, password } = resetPasswordSchema.parse(await req.json());
    const hashedToken = hashToken(token);

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        expires: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      return new NextResponse('Invalid or expired reset token', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
