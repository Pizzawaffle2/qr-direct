// File: src/app/api/email/preview/route.ts
import {NextResponse } from 'next/server';
import {render } from '@react-email/render';
import {VerificationEmail } from '@/emails/verification-email';
import {PasswordResetEmail } from '@/emails/password-reset-email';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get('template');
  const token = 'preview-token';
  const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${template === 'reset' ? 'reset-password' : 'verify-email'}?token=${token}`;

  try {
    let html;
    if (template === 'reset') {
      html = render(PasswordResetEmail({ resetUrl: previewUrl }));
    } else {
      html = render(VerificationEmail({ verificationUrl: previewUrl }));
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Email preview error:', error);
    return new NextResponse('Error generating email preview', { status: 500 });
  }
}
