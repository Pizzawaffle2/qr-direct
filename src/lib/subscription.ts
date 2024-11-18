// src/lib/subscription.ts
import { stripe } from './stripe';
import { prisma } from './db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]';

// Types and Interfaces
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business',
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

interface TierLimit {
  qrCodesPerMonth: number;
  customBranding: boolean;
  analytics: boolean;
}

type TierLimits = Record<SubscriptionTier, TierLimit>;

// Constants
export const TIER_LIMITS: TierLimits = {
  FREE: {
    qrCodesPerMonth: 10,
    customBranding: false,
    analytics: false,
  },
  PRO: {
    qrCodesPerMonth: 100,
    customBranding: true,
    analytics: true,
  },
  BUSINESS: {
    qrCodesPerMonth: -1, // unlimited
    customBranding: true,
    analytics: true,
  },
} as const;

// Helper Functions
const getAuthenticatedUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }
  return session.user;
};

const findOrCreateStripeCustomer = async (userId: string, email: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
};

// Main Functions
export async function createStripeCheckoutSession(priceId: string): Promise<string> {
  try {
    const user = await getAuthenticatedUser();
    if (!user.id || !user.email) {
      throw new Error('User ID or email is missing');
    }
    const stripeCustomerId = await findOrCreateStripeCustomer(user.id, user.email);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: new URL('/settings/billing?success=true', process.env.NEXT_PUBLIC_APP_URL).toString(),
      cancel_url: new URL('/settings/billing?canceled=true', process.env.NEXT_PUBLIC_APP_URL).toString(),
      metadata: {
        userId: user.id,
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session');
    }

    return checkoutSession.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createStripePortalSession(): Promise<string> {
  try {
    const user = await getAuthenticatedUser();
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { stripeCustomerId: true },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error('No Stripe customer found');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: new URL('/settings/billing', process.env.NEXT_PUBLIC_APP_URL).toString(),
    });

    if (!portalSession.url) {
      throw new Error('Failed to create portal session');
    }

    return portalSession.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Utility Functions
export const isValidTier = (tier: string): tier is SubscriptionTier => {
  return tier in SUBSCRIPTION_TIERS;
};

export const getTierLimit = (tier: SubscriptionTier): TierLimit => {
  return TIER_LIMITS[tier];
};
