// src/config/subscription.ts
export const SUBSCRIPTION_PLANS = {
    FREE: {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      priceDisplay: '$0',
      interval: 'month',
      features: [
        'Up to 5 QR codes',
        'Basic templates',
        'Standard QR codes',
        'Basic analytics',
        'Community support'
      ],
      limits: {
        qrCodes: 5,
        templates: 2,
        storage: 50 * 1024 * 1024, // 50MB
        analytics: 'basic',
        teamMembers: 1,
      }
    },
    PRO: {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals and small teams',
      price: 10,
      priceDisplay: '$10',
      interval: 'month',
      stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
      features: [
        'Unlimited QR codes',
        'Custom templates',
        'Advanced QR styles',
        'Detailed analytics',
        'Priority support',
        'API access',
        'Team collaboration (up to 5)',
        'Custom domains'
      ],
      limits: {
        qrCodes: -1, // unlimited
        templates: 50,
        storage: 500 * 1024 * 1024, // 500MB
        analytics: 'advanced',
        teamMembers: 5,
      }
    },
    ENTERPRISE: {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 49,
      priceDisplay: '$49',
      interval: 'month',
      stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'White labeling',
        'Advanced security',
        'Custom integration',
        'SLA guarantee',
        'Dedicated support',
        'Custom features'
      ],
      limits: {
        qrCodes: -1,
        templates: -1,
        storage: 5 * 1024 * 1024 * 1024, // 5GB
        analytics: 'enterprise',
        teamMembers: -1,
      }
    }
  } as const