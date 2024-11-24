// File: src/lib/utils/tokens.ts
import { randomBytes, createHash } from 'crypto';

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateExpiryDate(hours: number = 1): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
