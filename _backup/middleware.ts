// File: src/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, origin } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/',
    '/api/auth',
    '/verify-email',
  ];

  // Auth paths that signed-in users shouldn't access
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path) || pathname.includes('/api/auth/')
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Redirect authenticated users trying to access auth pages
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL('/', origin));
  }

  // Redirect unauthenticated users trying to access protected pages
  if (!token && !isPublicPath) {
    const callbackUrl = pathname;
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, origin)
    );
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
