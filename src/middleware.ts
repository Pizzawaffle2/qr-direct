// src/middleware.ts

import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PATHS } from '@/config/paths' 
import { withRateLimit } from '@/lib/rate-limit' // Import the rate limiting middleware

export async function middleware(request: NextRequest) {
  const { pathname, origin, searchParams } = request.nextUrl
  
  // Skip middleware for static assets and auth API routes
  if (PATHS.assets.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get the JWT token and user data
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Helper functions
  const isPublicPath = (path: string) =>
    PATHS.public.some(p => path.startsWith(p)) ||
    PATHS.auth.some(p => path.startsWith(p)) ||
    PATHS.api.some(p => path.startsWith(p))

  const isAuthPath = (path: string) =>
    PATHS.auth.some(p => path.startsWith(p))

  const isDashboardPath = (path: string) =>
    PATHS.dashboard.some(p => path.startsWith(p))

  const requiresProSubscription = (path: string) =>
    PATHS.subscription.pro.some(p => path.startsWith(p))

  const requiresEnterpriseSubscription = (path: string) =>
    PATHS.subscription.enterprise.some(p => path.startsWith(p))

  // Check for maintenance mode
  if (process.env.MAINTENANCE_MODE === 'true' && 
      !pathname.startsWith('/maintenance') && 
      !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/maintenance', origin))
  }

  // Apply rate limiting for API routes
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    const subscriptionTier = token?.subscription?.plan || 'free'
    
    // Use the imported withRateLimit middleware
    const rateLimitResponse = await withRateLimit(request, subscriptionTier) 
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }
  }

  // Handle authentication redirects
  if (token) {
    // Redirect authenticated users away from auth pages
    if (isAuthPath(pathname)) {
      const returnTo = searchParams.get('returnTo') || '/'
      return NextResponse.redirect(new URL(returnTo, origin))
    }

    // Check subscription requirements
    if (requiresProSubscription(pathname) && 
        !['pro', 'enterprise'].includes(token.subscription?.plan || 'free')) {
      return NextResponse.redirect(new URL('/billing?required=pro', origin))
    }

    if (requiresEnterpriseSubscription(pathname) && 
        token.subscription?.plan !== 'enterprise') {
      return NextResponse.redirect(new URL('/billing?required=enterprise', origin))
    }

    // Handle email verification requirement
    if (!token.emailVerified && 
        isDashboardPath(pathname) && 
        !pathname.startsWith('/dashboard/verify-email')) {
      return NextResponse.redirect(new URL('/dashboard/verify-email', origin))
    }

    // Allow access to protected routes
    return NextResponse.next()
  }

  // Handle unauthenticated users
  if (!token) {
    // Allow access to public paths
    if (isPublicPath(pathname)) {
      return NextResponse.next()
    }

    // Redirect to login with callback URL
    const callbackUrl = encodeURIComponent(pathname + searchParams.toString())
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, origin)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static assets and images
    '/((?!_next/static|_next/image|favicon.ico|public/|images/|assets/).*)',
    // Include API routes except auth
    '/api/:path*',
  ],
}