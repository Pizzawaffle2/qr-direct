const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Minimize output
  output: 'standalone',

  // Production optimizations
  compiler: {
    removeConsole: isProduction ? { exclude: ['error', 'warn'] } : false,
    reactRemoveProperties: isProduction ? { properties: ['^data-test'] } : false,
  },

  // Optimize images
  images: {
    domains: ['your-domain.com', 'cdn.example.com', 'images.example.org'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
  },

  // Custom redirects
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },

  // Production-only settings
  ...(isProduction && {
    typescript: {
      ignoreBuildErrors: true,
    },
  }),
};

module.exports = withBundleAnalyzer(nextConfig);
