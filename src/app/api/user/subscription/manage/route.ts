import {NextResponse } from 'next/server';
import {getServerSession } from 'next-auth/next';
import {authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {stripe } from '@/lib/stripe';
import {absoluteUrl } from '@/lib/utils';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const returnUrl = absoluteUrl('/dashboard/billing');

    // If no subscription exists, create a checkout session
    if (!user.subscriptionId) {
      const checkoutSession = await stripe.checkout.sessions.create({
        success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: returnUrl,
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        customer_email: user.email || undefined,
        line_items: [
          {
            price: process.env.STRIPE_PRO_PRICE_ID!,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
        },
        subscription_data: {
          trial_period_days: parseInt(process.env.DEFAULT_TRIAL_DAYS || '14'),
          metadata: {
            userId: user.id,
          },
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Create Stripe billing portal session for existing subscribers
    if (!user.stripeCustomerId) {
      return NextResponse.json({ message: 'No associated Stripe customer' }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json({ message: 'Failed to create portal session' }, { status: 500 });
  }
}
