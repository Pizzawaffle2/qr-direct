import {NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define rate limits per subscription tier (requests per minute)
const RATE_LIMITS = {
  free: 60,
  pro: 300,
  enterprise: 1000,
} as const;

type SubscriptionTier = keyof typeof RATE_LIMITS;

// In-memory store for rate limiting
// Note: In production, use Redis or similar for distributed systems
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export async function withRateLimit(
  request: NextRequest,
  subscriptionTier: SubscriptionTier | string = 'free'
): Promise<NextResponse | null> {
  const ip = request.ip || 'anonymous';
  const tier = subscriptionTier as SubscriptionTier;
  const limit = RATE_LIMITS[tier] || RATE_LIMITS.free;
  const windowMs = 60 * 1000; // 1 minute window

  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.timestamp < windowStart) {
      rateLimitStore.delete(key);
    }
  }

  // Get or create rate limit info for this IP
  const rateLimit = rateLimitStore.get(ip) || { count: 0, timestamp: now };

  // Reset if outside window
  if (rateLimit.timestamp < windowStart) {
    rateLimit.count = 0;
    rateLimit.timestamp = now;
  }

  // Increment count
  rateLimit.count++;
  rateLimitStore.set(ip, rateLimit);

  // Set rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', Math.max(0, limit - rateLimit.count).toString());
  headers.set('X-RateLimit-Reset', (rateLimit.timestamp + windowMs).toString());

  // Check if rate limit exceeded
  if (rateLimit.count > limit) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${Math.ceil((rateLimit.timestamp + windowMs - now) / 1000)} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.entries()),
        },
      }
    );
  }

  // Add rate limit headers to the original response
  const response = NextResponse.next();
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return null;
}

// Optional: Add helper function to reset rate limits (useful for testing)
export function resetRateLimits() {
  rateLimitStore.clear();
}
