import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { updateUserSubscriptionStatus } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import type Stripe from 'stripe';
import { Prisma } from '@prisma/client';

// Utility function for safe database operations
async function safeDbOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('Database operation failed:', e.code, e.message);
    } else {
      console.error('Operation failed:', e);
    }
    return fallback;
  }
}

// Customer Handlers
async function handleCustomerCreated(customer: Stripe.Customer) {
  if (!customer.email) {
    console.log('No email found for customer:', customer.id);
    return;
  }

  await safeDbOperation(async () => {
    // First try to find user by email
    const user = await prisma.user.findUnique({
      where: { email: customer.email! }
    });

    if (user) {
      await prisma.user.update({
        where: { email: customer.email! },
        data: { stripeCustomerId: customer.id }
      });
    } else {
      console.log('No user found for email:', customer.email);
    }
  }, null);
}

async function handleCustomerUpdated(customer: Stripe.Customer) {
  await safeDbOperation(async () => {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customer.id }
    });

    if (user) {
      await prisma.user.update({
        where: { stripeCustomerId: customer.id },
        data: {
          email: customer.email || undefined,
          name: customer.name || undefined,
        }
      });
    } else {
      console.log('No user found for customer:', customer.id);
    }
  }, null);
}

// Invoice Handlers
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  if (!customerId) {
    console.log('No customer ID found in invoice');
    return;
  }

  await safeDbOperation(async () => {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId }
    });

    if (user) {
      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: { subscriptionStatus: 'active' }
      });
    } else {
      console.log('No user found for customer:', customerId);
    }
  }, null);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  if (!customerId) {
    console.log('No customer ID found in invoice');
    return;
  }

  await safeDbOperation(async () => {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId }
    });

    if (user) {
      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: { subscriptionStatus: 'past_due' }
      });
    } else {
      console.log('No user found for customer:', customerId);
    }
  }, null);
}

// Subscription Handlers
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    console.log('No userId found in subscription metadata:', subscription.id);
    return;
  }

  await safeDbOperation(async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      await updateUserSubscriptionStatus(userId, subscription);
    } else {
      console.log('No user found for ID:', userId);
    }
  }, null);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    console.log('No userId found in subscription metadata:', subscription.id);
    return;
  }

  await safeDbOperation(async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: 'inactive',
          subscriptionTier: 'free',
          subscriptionId: null,
          subscriptionCurrentPeriodEnd: null,
        }
      });
    }
  }, null);
}

// Checkout Handler
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session:', session.id);

  // First, ensure we have a customer ID
  if (!session.customer) {
    console.log('No customer ID in session');
    return;
  }

  try {
    // Get the customer details from Stripe
    const customer = await stripe.customers.retrieve(session.customer as string);
    if (!customer || customer.deleted) {
      console.log('Customer not found or deleted:', session.customer);
      return;
    }

    // Find or create user
    const email = customer.email;
    if (!email) {
      console.log('No email found for customer:', customer.id);
      return;
    }

    await safeDbOperation(async () => {
      // Try to find user by email first
      let user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (user) {
        // Update existing user
        user = await prisma.user.update({
          where: { email: email },
          data: {
            stripeCustomerId: customer.id,
            name: customer.name || user.name,
            subscriptionStatus: 'active',
            subscriptionTier: 'pro', // Or determine from the session/price
            subscriptionCurrentPeriodEnd: session.expires_at 
              ? new Date(session.expires_at * 1000)
              : undefined
          }
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
            subscriptionTier: 'pro', // Or determine from the session/price
            subscriptionCurrentPeriodEnd: session.expires_at 
              ? new Date(session.expires_at * 1000)
              : undefined
          }
        });
        console.log('Created new user:', user.id);
      }

      // If we have a subscription, process it
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Update the subscription with the user ID
        await stripe.subscriptions.update(subscription.id, {
          metadata: {
            userId: user.id
          }
        });

        // Update user's subscription details
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionId: subscription.id,
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });

        console.log('Updated subscription with user ID:', user.id);
      }
    }, null);
  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const rawSignature = headersList.get('stripe-signature');

    if (!rawSignature) {
      return NextResponse.json({ message: 'No signature found' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        rawSignature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const error = err as Error;
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { message: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    console.log('Processing webhook event:', event.type);

    try {
      switch (event.type) {
        // Subscription events
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        // Customer events
        case 'customer.created':
          await handleCustomerCreated(event.data.object as Stripe.Customer);
          break;
        case 'customer.updated':
          await handleCustomerUpdated(event.data.object as Stripe.Customer);
          break;

        // Invoice events
        case 'invoice.paid':
        case 'invoice.payment_succeeded':
          await handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        // Checkout events
        case 'checkout.session.completed':
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        // Logging only events
        case 'payment_intent.succeeded':
        case 'payment_intent.created':
        case 'payment_method.attached':
        case 'invoice.created':
        case 'invoice.finalized':
        case 'product.created':
        case 'price.created':
        case 'plan.created':
        case 'charge.succeeded':
          console.log(`Logged event ${event.type}`);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return NextResponse.json({
        received: true,
        type: event.type,
        processedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Webhook handler failed:', error);
      return NextResponse.json({
        message: 'Webhook handler failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        type: event.type
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  const headersList = await headers();
  
  return NextResponse.json({
    status: 'healthy',
    message: 'Stripe webhook endpoint is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}