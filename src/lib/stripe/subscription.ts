// src/lib/stripe/subscription.ts
import {stripe } from './config';
import {prisma } from '@/lib/db/prisma';
import {getServerSession } from 'next-auth';
import {authOptions } from '@/app/api/auth/[...nextauth]/route';
import {SubscriptionStatus } from './types';
import {SUBSCRIPTION_PLANS, SubscriptionPlan } from './subscriptionPlans';

export class SubscriptionService {
  /**
   * Create a Stripe Checkout session for subscription
   */
  static async createCheckoutSession(priceId: string): Promise<string> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    const user = await this.getOrCreateCustomer(session.user.email);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId!,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return checkoutSession.url!;
  }

  /**
   * Create a Stripe Customer Portal session
   */
  static async createPortalSession(): Promise<string> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.stripeCustomerId) {
      throw new Error('No Stripe customer found');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return portalSession.url;
  }

  /**
   * Get or create a Stripe customer
   */
  private static async getOrCreateCustomer(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.stripeCustomerId) {
      return user;
    }

    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId: user.id,
      },
    });

    return await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  /**
   * Get subscription status for a user
   */
  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      isActive: user.subscriptionStatus === 'active',
      plan: user.subscriptionTier,
      periodEnd: user.subscriptionCurrentPeriodEnd,
      isCanceled: user.subscriptionStatus === 'canceled',
    };
  }

  /**
   * Check if user has access to a feature
   */
  static async hasAccess(
    userId: string,
    feature: keyof SubscriptionPlan['limits']
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.subscriptionTier) {
      return SUBSCRIPTION_PLANS.FREE.limits[feature];
    }

    const plan = SUBSCRIPTION_PLANS[user.subscriptionTier.toUpperCase()];
    return plan.limits[feature];
  }

  /**
   * Check if user has reached their QR code limit
   */
  static async hasReachedQRLimit(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const plan = user.subscriptionTier
      ? SUBSCRIPTION_PLANS[user.subscriptionTier.toUpperCase()]
      : SUBSCRIPTION_PLANS.FREE;

    if (plan.limits.qrCodesPerMonth === -1) {
      return false;
    }

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const qrCodesThisMonth = await prisma.qRCode.count({
      where: {
        userId,
        created: {
          gte: monthStart,
        },
      },
    });

    return qrCodesThisMonth >= plan.limits.qrCodesPerMonth;
  }
}
