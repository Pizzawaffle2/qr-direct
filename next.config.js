// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: [
        'avatars.githubusercontent.com', 
        'lh3.googleusercontent.com'
      ],
      formats: ['image/avif', 'image/webp'],
    },
    experimental: {
      serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
      optimizeCss: true,
      scrollRestoration: true
    },
    webpack: (config) => {
      config.externals = [...config.externals, { canvas: 'canvas' }]
      return config
    },
    headers: async () => {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            }
          ],
        },
      ]
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    }
  }
  
  module.exports = nextConfig