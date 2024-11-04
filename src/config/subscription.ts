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
        'Basic analytics',
        'Standard support',
        'Basic templates',
      ],
      limits: {
        qrCodes: 5,
        templates: 2,
        storage: 50 * 1024 * 1024, // 50MB
        analytics: 'basic',
        teamMembers: 1,
      },
    },
    PRO: {
      id: 'pro',
      name: 'Pro',
      description: 'Best for professionals',
      price: 10,
      priceDisplay: '$10',
      interval: 'month',
      stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
      features: [
        'Unlimited QR codes',
        'Advanced analytics',
        'Priority support',
        'Custom templates',
        'Team collaboration',
        'API access',
        'Custom domains',
      ],
      limits: {
        qrCodes: -1, // unlimited
        templates: 50,
        storage: 500 * 1024 * 1024, // 500MB
        analytics: 'advanced',
        teamMembers: 5,
      },
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
        'Dedicated support',
        'Custom integration',
        'SLA guarantee',
        'Advanced security',
        'Custom features',
      ],
      limits: {
        qrCodes: -1,
        templates: -1,
        storage: 5 * 1024 * 1024 * 1024, // 5GB
        analytics: 'enterprise',
        teamMembers: -1,
      },
    },
  } as const
  
  export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
  export type PlanId = typeof SUBSCRIPTION_PLANS[SubscriptionPlan]['id']
  
  export interface SubscriptionLimits {
    qrCodes: number
    templates: number
    storage: number
    analytics: 'basic' | 'advanced' | 'enterprise'
    teamMembers: number
  }
  
  export const DEFAULT_PLAN = SUBSCRIPTION_PLANS.FREE
  
  export function getPlanFromPriceId(priceId: string): SubscriptionPlan | null {
    const plan = Object.entries(SUBSCRIPTION_PLANS).find(
      ([_, plan]) => plan.stripePriceId === priceId
    )
    return plan ? (plan[0] as SubscriptionPlan) : null
  }
  
  export function isWithinPlanLimits(
    plan: SubscriptionPlan,
    type: keyof SubscriptionLimits,
    currentValue: number
  ): boolean {
    const limit = SUBSCRIPTION_PLANS[plan].limits[type]
    return limit === -1 || currentValue < limit
  }