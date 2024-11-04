export const PATHS = {
    public: [
      '/',
      '/pricing',
      '/about',
      '/contact',
      '/blog',
      '/terms',
      '/privacy',
    ],
    auth: [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
    ],
    api: [
      '/api/auth',
      '/api/webhooks',
      '/api/qr/public',
    ],
    assets: [
      '/_next',
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml',
      '/manifest.json',
    ],
    dashboard: [
      '/dashboard',
      '/settings',
      '/billing',
      '/team',
      '/qr',
    ],
    subscription: {
      pro: [
        '/api/advanced',
        '/dashboard/analytics',
        '/dashboard/team',
      ],
      enterprise: [
        '/api/enterprise',
        '/dashboard/white-label',
      ],
    },
  } as const