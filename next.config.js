const bundleAnalyzer = require('@next/bundle-analyzer');
const NextPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = NextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',

  // Compiler optimizations
  compiler: {
    removeConsole: isProduction ? { exclude: ['error', 'warn'] } : false,
    reactRemoveProperties: isProduction ? { properties: ['^data-test'] } : false,
  },

  // Image optimization
  images: {
    domains: [
      'your-domain.com',
      'cdn.example.com',
      'images.example.org',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize modules
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: isServer ? undefined : 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            enforce: true,
          },
          // Commons chunk
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Lib chunk
          lib: {
            test: /[\\/]node_modules[\\/](react|react-dom|framer-motion)[\\/]/,
            name: 'lib',
            priority: 30,
            enforce: true,
          },
        },
      },
    };

    // Add performance hints in production
    if (isProduction) {
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }

    // Development optimizations
    if (isDevelopment && !isServer) {
      config.devtool = 'eval-source-map';
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects configuration
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
      {
        source: '/api/:path*',
        has: [
          {
            type: 'header',
            key: 'x-skip-middleware',
          },
        ],
        destination: '/api/:path*',
        permanent: true,
      },
    ];
  },

  // Production-only settings
  ...(isProduction && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    swcMinify: true,
    productionBrowserSourceMaps: false,
  }),

  // Development-only settings
  ...(isDevelopment && {
    typescript: {
      ignoreBuildErrors: false,
    },
    eslint: {
      ignoreDuringBuilds: false,
    },
  }),

  // Experimental features
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['framer-motion'],
    optimizeCss: true,
    scrollRestoration: true,
  },
};

// Compose the config with both bundle analyzer and PWA
const withBundleAnalyzerAndPWA = (config) => {
  return withBundleAnalyzer(
    withPWA({
      ...config,
      pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        register: true,
        skipWaiting: true,
        runtimeCaching,
        buildExcludes: [/middleware-manifest.json$/],
      },
    })
  );
};

// Export the final config
module.exports = withBundleAnalyzerAndPWA(nextConfig);