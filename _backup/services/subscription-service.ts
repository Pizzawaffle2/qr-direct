// src/services/subscription-service.ts

import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { ApiError } from '@/lib/errors';

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic QR codes', '5 QR codes per month', 'Basic analytics', 'Standard support'],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 10,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Everything in Free',
      'Unlimited QR codes',
      'Custom designs',
      'Advanced analytics',
      'Priority support',
    ],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Everything in Pro',
      'Custom domain',
      'API access',
      'Team collaboration',
      'Dedicated support',
      'Custom features',
    ],
  },
} as const;

export class SubscriptionService {
  static async createCheckoutSession(userId: string, priceId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      if (!user) {
        throw new ApiError('User not found', 404);
      }

      // Create or get Stripe customer
      let customerId = user.subscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email!,
          metadata: {
            userId,
          },
        });
        customerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
        metadata: {
          userId,
        },
      });

      return session;
    } catch (error) {
      console.error('Checkout session error:', error);
      throw new ApiError('Failed to create checkout session', 500);
    }
  }

  static async createBillingPortalSession(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      if (!user?.subscription?.stripeCustomerId) {
        throw new ApiError('No subscription found', 404);
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.subscription.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      });

      return session;
    } catch (error) {
      console.error('Billing portal error:', error);
      throw new ApiError('Failed to create billing portal session', 500);
    }
  }

  static async cancelSubscription(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      if (!user?.subscription?.stripeSubscriptionId) {
        throw new ApiError('No subscription found', 404);
      }

      await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      await prisma.subscription.update({
        where: { userId },
        data: {
          cancelAtPeriodEnd: true,
        },
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw new ApiError('Failed to cancel subscription', 500);
    }
  }

  static async resumeSubscription(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      if (!user?.subscription?.stripeSubscriptionId) {
        throw new ApiError('No subscription found', 404);
      }

      await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });

      await prisma.subscription.update({
        where: { userId },
        data: {
          cancelAtPeriodEnd: false,
        },
      });
    } catch (error) {
      console.error('Resume subscription error:', error);
      throw new ApiError('Failed to resume subscription', 500);
    }
  }
}
