// src/lib/rate-limit/index.ts

import { redis } from './redis'
import { Ratelimit } from '@upstash/ratelimit'
import { subscriptionLimits } from '@/config/subscription'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export type RateLimitConfig = {
  window: number // in seconds
  requestLimit: number
  identifier?: string
}

interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number // timestamp
  success: boolean
}

const DEFAULT_LIMITS = {
  free: { window: 60, limit: 100 },    // 100 requests per minute
  pro: { window: 60, limit: 1000 },    // 1000 requests per minute
  enterprise: { window: 60, limit: 10000 }, // 10000 requests per minute
} as const

export class RateLimiter {
  private limiters: Map<string, Ratelimit> = new Map()

  constructor() {
    // Create limiters for each subscription tier
    Object.entries(DEFAULT_LIMITS).forEach(([tier, config]) => {
      this.limiters.set(
        tier,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(config.limit, `${config.window} s`),
          analytics: true,
          prefix: `ratelimit:${tier}`,
        })
      )
    })
  }

  private getIdentifier(req: NextRequest): string {
    // Get identifier based on authentication status
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    const ip = req.ip || 'anonymous'
    
    return token || ip
  }

  private getLimiter(subscriptionTier: keyof typeof DEFAULT_LIMITS): Ratelimit {
    const limiter = this.limiters.get(subscriptionTier)
    if (!limiter) {
      throw new Error(`No rate limiter found for tier: ${subscriptionTier}`)
    }
    return limiter
  }

  async isRateLimited(
    req: NextRequest,
    subscriptionTier: keyof typeof DEFAULT_LIMITS = 'free'
  ): Promise<RateLimitInfo> {
    const identifier = this.getIdentifier(req)
    const limiter = this.getLimiter(subscriptionTier)
    
    // Check rate limit
    const { success, limit, remaining, reset } = await limiter.limit(identifier)
    
    return { success, limit, remaining, reset }
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter()

// Middleware helper
export async function withRateLimit(
  req: NextRequest,
  subscriptionTier: keyof typeof DEFAULT_LIMITS = 'free'
) {
  const rateLimitInfo = await rateLimiter.isRateLimited(req, subscriptionTier)

  if (!rateLimitInfo.success) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        rateLimitInfo: {
          limit: rateLimitInfo.limit,
          remaining: rateLimitInfo.remaining,
          reset: new Date(rateLimitInfo.reset).toISOString(),
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
          'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
          'X-RateLimit-Reset': rateLimitInfo.reset.toString(),
          'Retry-After': Math.ceil(
            (rateLimitInfo.reset - Date.now()) / 1000
          ).toString(),
        },
      }
    )
  }

  return null
}