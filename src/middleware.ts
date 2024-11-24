import {getToken } from 'next-auth/jwt';
import {NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/login',
  '/register',
  '/error',
  '/forgot-password',
  '/reset-password',
  '/verify',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect authenticated users away from auth pages
  if (token && publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
