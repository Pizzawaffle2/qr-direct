// src/lib/utils/tokens.ts
import { randomBytes } from 'crypto';

export async function generateToken(): Promise<string> {
  return randomBytes(32).toString('hex');
}

export function generateExpirationDate(duration: number, unit: string): Date {
  const now = new Date();
  switch (unit) {
    case 'minutes':
      return new Date(now.getTime() + duration * 60 * 1000);
    case 'hours':
      return new Date(now.getTime() + duration * 60 * 60 * 1000);
    case 'days':
      return new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
    default:
      throw new Error('Invalid unit for expiration date');
  }
}