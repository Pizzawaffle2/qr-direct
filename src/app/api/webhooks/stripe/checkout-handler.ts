import type Stripe from 'stripe';
import {prisma } from '@/lib/prisma';
import {stripe } from '@/lib/stripe';
import {getSubscriptionTierFromSession } from '@/lib/stripe-utils';

export async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session:', {
    id: session.id,
    customerId: session.customer,
    email: session.customer_email,
  });

  if (!session.customer) {
    console.log('No customer ID in session');
    return;
  }

  try {
    const customer = await stripe.customers.retrieve(session.customer as string);
    if (!customer || customer.deleted) {
      console.log('Customer not found or deleted:', session.customer);
      return;
    }

    const email = session.customer_email || customer.email;
    if (!email) {
      console.log('No email found for customer:', customer.id);
      return;
    }

    const subscriptionTier = await getSubscriptionTierFromSession(session, stripe);
    console.log('Determined subscription tier:', subscriptionTier);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { email: email },
        data: {
          stripeCustomerId: customer.id,
          name: customer.name || user.name,
          subscriptionStatus: 'active',
          subscriptionTier: subscriptionTier,
          subscriptionCurrentPeriodEnd: session.expires_at
            ? new Date(session.expires_at * 1000)
            : undefined,
        },
      });
      console.log('Updated existing user:', user.id);
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: email,
          name: customer.name || undefined,
          stripeCustomerId: customer.id,
          subscriptionStatus: 'active',
          subscriptionTier: subscriptionTier,
          subscriptionCurrentPeriodEnd: session.expires_at
            ? new Date(session.expires_at * 1000)
            : undefined,
        },
      });
      console.log('Created new user:', user.id);
    }

    // Handle subscription if present
    if (session.subscription) {
      await stripe.subscriptions.update(session.subscription as string, {
        metadata: {
          userId: user.id,
        },
      });

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionId: subscription.id,
          subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      console.log('Updated subscription metadata for user:', user.id);
    }

    return user;
  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}
