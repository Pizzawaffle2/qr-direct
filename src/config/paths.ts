export const PATHS = {
  assets: [
    '/_next',
    '/favicon.ico',
    '/public',
    '/images',
    '/assets',
  ],
  public: [
    '/',
    '/about',
    '/pricing',
    '/contact',
    '/blog',
    '/features',
    '/privacy',
    '/terms',
  ],
  auth: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ],
  api: [
    '/api/health',
    '/api/webhooks',
    '/api/public',
  ],
  dashboard: [
    '/dashboard',
    '/settings',
    '/profile',
  ],
  subscription: {
    pro: [
      '/dashboard/pro',
      '/api/pro',
      '/features/pro',
    ],
    enterprise: [
      '/dashboard/enterprise',
      '/api/enterprise',
      '/features/enterprise',
    ],
  },
} as const;