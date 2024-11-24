import { prisma } from '@/lib/prisma';
import { emailService } from '@/services/email-service';
import { createHash, randomBytes } from 'crypto';

export class VerificationService {
  static generateToken() {
    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
  }

  static async createVerificationToken(email: string) {
    const { token, hashedToken } = this.generateToken();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return token;
  }

  static async sendVerificationEmail(email: string) {
    const token = await this.createVerificationToken(email);
    await emailService.sendVerificationEmail(email, token);
  }

  static async verifyEmail(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      throw new Error('Invalid or expired token');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: hashedToken,
          },
        },
      }),
    ]);

    return verificationToken.identifier;
  }

  static async resendVerificationEmail(email: string) {
    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    await this.sendVerificationEmail(email);
  }
}
