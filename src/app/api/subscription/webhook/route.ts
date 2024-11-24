// src/app/api/subscription/webhook/route.ts
import {headers } from 'next/headers';
import {stripe } from '@/lib/stripe/config';
import {prisma } from '@/lib/db/prisma';
import {Stripe } from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await handleStripeEvent(event);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response('Webhook Error', { status: 400 });
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeletion(event.data.object as Stripe.Subscription);
      break;
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  await prisma.user.update({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    data: {
      subscriptionStatus: subscription.status,
      subscriptionTier: subscription.items.data[0].price.lookup_key,
      subscriptionId: subscription.id,
      subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  await prisma.user.update({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    data: {
      subscriptionStatus: 'canceled',
      subscriptionTier: null,
      subscriptionId: null,
      subscriptionCurrentPeriodEnd: null,
    },
  });
}
