// src/lib/config/client.ts
export interface ClientConfig {
  app: {
    name: string;
    url: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  features: {
    teamFeatures: boolean;
    apiAccess: boolean;
    analytics: boolean;
  };
  stripe: {
    publishableKey: string | undefined;
    proPriceId: string | undefined;
    enterprisePriceId: string | undefined;
  };
  api: {
    baseUrl: string;
    version: string;
  };
}

export const config: ClientConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'QR Direct',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment:
      (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
  },
  features: {
    teamFeatures: process.env.NEXT_PUBLIC_ENABLE_TEAM_FEATURES === 'true',
    apiAccess: process.env.NEXT_PUBLIC_ENABLE_API_ACCESS === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    proPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    enterprisePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    version: 'v1',
  },
};

// Helper functions for accessing config values
export function getConfig(): ClientConfig {
  return config;
}

export function getAppConfig() {
  return config.app;
}

export function getFeaturesConfig() {
  return config.features;
}

export function getStripeConfig() {
  return config.stripe;
}

export function getApiConfig() {
  return config.api;
}

// Type guard for checking if Stripe is configured
export function isStripeConfigured(): boolean {
  return Boolean(
    config.stripe.publishableKey && config.stripe.proPriceId && config.stripe.enterprisePriceId
  );
}

// Helper for getting environment-specific values
export function getEnvironmentConfig<T>(development: T, staging: T, production: T): T {
  switch (config.app.environment) {
    case 'production':
      return production;
    case 'staging':
      return staging;
    default:
      return development;
  }
}

// Utility for feature flags
export const features = {
  isEnabled: (featureName: keyof ClientConfig['features']): boolean => {
    return config.features[featureName];
  },

  requireFeature: (featureName: keyof ClientConfig['features']): void => {
    if (!config.features[featureName]) {
      throw new Error(`Feature "${featureName}" is not enabled`);
    }
  },
};

// Constants
export const APP_NAME = config.app.name;
export const APP_URL = config.app.url;
export const IS_PRODUCTION = config.app.environment === 'production';
export const IS_DEVELOPMENT = config.app.environment === 'development';
export const API_BASE_URL = config.api.baseUrl;

// React hook for accessing config in components
import {useCallback } from 'react';

export function useConfig() {
  const getFeatureFlag = useCallback((feature: keyof ClientConfig['features']) => {
    return config.features[feature];
  }, []);

  return {
    config,
    getFeatureFlag,
    isProduction: IS_PRODUCTION,
    isDevelopment: IS_DEVELOPMENT,
    appName: APP_NAME,
    appUrl: APP_URL,
    apiBaseUrl: API_BASE_URL,
    isStripeConfigured: isStripeConfigured(),
  };
}

// Export everything
export default {
  ...config,
  getConfig,
  getAppConfig,
  getFeaturesConfig,
  getStripeConfig,
  getApiConfig,
  isStripeConfigured,
  getEnvironmentConfig,
  features,
  useConfig,
};
