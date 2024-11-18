// pages/_app.tsx
import { AppProps } from 'next/app';
import { Layout } from '@/components/layout';
import { ClientConfig } from '@/lib/config/client';
import '@/styles/globals.css';

// Remove the bootstrap call from _app.tsx as it shouldn't run on client

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

// Add middleware to handle server-side secrets
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ServerConfig } from '@/lib/config/server';

export async function middleware(request: NextRequest) {
  // Only run on API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  try {
    // Load any necessary secrets for API routes
    const config = ServerConfig.getInstance();
    // Continue to the API route
    return NextResponse.next();
  } catch (error) {
    console.error('Failed to load server configuration:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};