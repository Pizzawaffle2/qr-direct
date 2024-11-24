// src/lib/stripe/plans.ts
import {SubscriptionPlan } from './types';

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
    id: 'free',
    name: 'Free',
    description: 'For personal use',
    priceId: '',
    price: 0,
    features: ['10 QR codes per month', 'Basic templates', 'Standard support'],
    limits: {
      qrCodesPerMonth: 10,
      customBranding: false,
      analytics: false,
      teamMembers: 1,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals',
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    price: 9,
    features: ['100 QR codes per month', 'Custom branding', 'Analytics', 'Priority support'],
    limits: {
      qrCodesPerMonth: 100,
      customBranding: true,
      analytics: true,
      teamMembers: 1,
    },
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    description: 'For teams',
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || '',
    price: 29,
    features: [
      'Unlimited QR codes',
      'Custom branding',
      'Advanced analytics',
      '24/7 support',
      'Team management',
    ],
    limits: {
      qrCodesPerMonth: -1,
      customBranding: true,
      analytics: true,
      teamMembers: 5,
    },
  },
};
