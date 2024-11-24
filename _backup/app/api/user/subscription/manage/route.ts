import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const returnUrl = absoluteUrl('/dashboard/billing');

    if (!user.stripeCustomerId) {
      if (!user.email) {
        return NextResponse.json({ message: 'User email is required' }, { status: 400 });
      }
      // Create new checkout session
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: user.email,
        metadata: { userId: user.id },
        line_items: [
          {
            price: process.env.STRIPE_PRO_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: returnUrl,
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Create portal session for existing customer
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to manage subscription' },
      { status: 500 }
    );
  }
}
