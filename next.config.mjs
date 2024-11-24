// next.config.mjs
import nextPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 500000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Library chunk
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              return `${cacheGroupKey}-${chunks[0].name}`;
            },
            chunks: 'all',
            minChunks: 2,
            priority: 30,
            maxInitialRequests: 10,
            minSize: 0,
            maxSize: 244000,
          },
        },
      },
    };

    // Fix for 'self is not defined'
    config.output = {
      ...config.output,
      globalObject: 'globalThis',
    };

    // Development optimizations
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },

  // Experimental features
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['framer-motion'],
    optimizeCss: true,
    scrollRestoration: true,
    esmExternals: true,
  },
};

export default withPWA(nextConfig);