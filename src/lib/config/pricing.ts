export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'For individuals and small projects',
    features: [
      { name: 'Basic QR Code Generation', enabled: true },
      { name: 'Basic Templates', enabled: true },
      { name: 'Basic Analytics', enabled: true },
      { name: 'Community Support', enabled: true },
      { name: 'Ad-Free Experience', enabled: true }, // Added to free tier
    ],
    limits: {
      qrCodes: 25,
      templates: 3,
      teamMembers: 1,
      analytics: false,
      customDomain: false,
      api: false,
      storage: 100, // MB
      scanLimit: 1000,
    },
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: '',
      yearly: '',
    },
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For professionals and growing businesses',
    features: [
      { name: 'Advanced QR Generation', enabled: true },
      { name: 'Premium Templates', enabled: true },
      { name: 'Advanced Analytics', enabled: true },
      { name: 'Priority Support', enabled: true },
      { name: 'API Access', enabled: true },
      { name: 'Custom Domain', enabled: true },
      { name: 'Custom Branding', enabled: true },
      { name: 'Bulk Operations', enabled: true },
      { name: 'Team Collaboration', enabled: true },
    ],
    limits: {
      qrCodes: 1000,
      templates: 50,
      teamMembers: 5,
      analytics: true,
      customDomain: true,
      api: true,
      storage: 5000, // MB
      scanLimit: 50000,
    },
    prices: {
      monthly: 29,
      yearly: 290,
    },
    stripeIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    features: [
      { name: 'Unlimited QR Generation', enabled: true },
      { name: 'Premium Template Library', enabled: true },
      { name: 'Enterprise Analytics', enabled: true },
      { name: 'Dedicated Support', enabled: true },
      { name: 'Advanced API Access', enabled: true },
      { name: 'Multiple Custom Domains', enabled: true },
      { name: 'SSO Integration', enabled: true },
      { name: 'Custom Integration', enabled: true },
      { name: 'SLA Support', enabled: true },
      { name: 'Audit Logs', enabled: true },
    ],
    limits: {
      qrCodes: -1, // unlimited
      templates: -1, // unlimited
      teamMembers: -1, // unlimited
      analytics: true,
      customDomain: true,
      api: true,
      storage: -1, // unlimited
      scanLimit: -1, // unlimited
    },
    prices: {
      monthly: 99,
      yearly: 990,
    },
    stripeIds: {
      monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
    },
  },
];
