import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export class StripeService {
  static async createCustomer(userId: string, email: string) {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    await prisma.subscription.create({
      data: {
        userId,
        stripeCustomerId: customer.id,
        plan: 'free',
      },
    });

    return customer;
  }

  static async createCheckoutSession(userId: string, priceId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) throw new Error('User not found');

    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.createCustomer(userId, user.email!);
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        userId,
      },
    });

    return session;
  }

  static async createPortalSession(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user?.subscription?.stripeCustomerId) {
      throw new Error('No subscription found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return session;
  }
}
