// src/config/api.ts
export const API_CONFIG = {
    rateLimit: {
      window: 60 * 1000, // 1 minute
      max: {
        free: 100,
        pro: 1000,
        enterprise: 10000
      }
    },
    cors: {
      origins: [
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },
    version: 'v1'
  } as const
  