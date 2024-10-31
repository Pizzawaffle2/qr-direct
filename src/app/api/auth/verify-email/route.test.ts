import { POST, PUT } from './route';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

jest.mock('@/lib/prisma');
jest.mock('resend');

// Define mockPrisma with user and verificationToken as non-optional fields
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  verificationToken: {
    findFirst: jest.fn(),
  },
} as any; // Use 'as any' here to avoid TS checks for test setup

const mockResend = Resend as jest.Mocked<typeof Resend>;

describe('Email Verification API', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock return values for each test
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.verificationToken.findFirst.mockResolvedValue(null);
  });

  describe('POST /api/auth/verify-email', () => {
    it('should return 404 if user is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      const res = await POST(req);

      expect(res.status).toBe(404);
      expect(await res.text()).toBe('User not found');
    });

    it('should return 400 if email is already verified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ emailVerified: true });

      const req = new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      const res = await POST(req);

      expect(res.status).toBe(400);
      expect(await res.text()).toBe('Email already verified');
    });

    // Additional tests for other scenarios...
  });

  describe('PUT /api/auth/verify-email', () => {
    it('should return 400 if token is invalid or expired', async () => {
      mockPrisma.verificationToken.findFirst.mockResolvedValue(null);

      const req = new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify({ token: 'invalid-token' }),
      });

      const res = await PUT(req);

      expect(res.status).toBe(400);
      expect(await res.text()).toBe('Invalid or expired verification token');
    });

    // Additional tests for other scenarios...
  });
});
