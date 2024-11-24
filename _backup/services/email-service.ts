// File: src/services/email-service.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { VerificationEmail } from '@/emails/verification-email';
import { PasswordResetEmail } from '@/emails/password-reset-email';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'QR Direct <onboarding@qr-direct.com>'; // Update with your verified domain

class EmailService {
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    try {
      const html = render(VerificationEmail({ verificationUrl }));

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify your email address',
        html,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
      const html = render(PasswordResetEmail({ resetUrl }));

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset your password',
        html,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

export const emailService = new EmailService();
