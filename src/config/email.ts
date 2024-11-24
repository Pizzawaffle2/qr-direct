// src/config/email.ts
export const EMAIL_CONFIG = {
  templates: {
    welcome: {
      subject: 'Welcome to QR Direct!',
      preheader: 'Get started with QR Direct',
    },
    verifyEmail: {
      subject: 'Verify your email',
      preheader: 'Complete your registration',
    },
    resetPassword: {
      subject: 'Reset your password',
      preheader: 'Reset your QR Direct password',
    },
    teamInvite: {
      subject: "You've been invited to join a team on QR Direct",
      preheader: 'Team invitation',
    },
  },
  sender: {
    name: 'QR Direct',
    email: process.env.RESEND_FROM_EMAIL || 'noreply@qr-direct.com',
  },
  expiryTimes: {
    verifyEmail: 24 * 60 * 60 * 1000, // 24 hours
    resetPassword: 1 * 60 * 60 * 1000, // 1 hour
    teamInvite: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
} as const;
