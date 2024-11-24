import { prisma } from '@/lib/prisma';
import { VerificationService } from '@/lib/services/verification-service';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    if (user.emailVerified) {
      return new Response(JSON.stringify({ error: 'Email already verified' }), {
        status: 400,
      });
    }

    await VerificationService.resendVerificationEmail(email);

    return new Response(JSON.stringify({ message: 'Verification email sent' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return new Response(JSON.stringify({ error: 'Failed to resend verification email' }), {
      status: 500,
    });
  }
}
