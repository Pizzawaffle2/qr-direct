// src/app/api/webhooks/stripe/route.ts

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        if (session.metadata?.type === 'team') {
          // Handle team subscription
          await prisma.teamSubscription.upsert({
            where: {
              teamId: session.metadata.teamId,
            },
            create: {
              teamId: session.metadata.teamId,
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              plan: session.metadata.plan || 'free',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              seats: parseInt(session.metadata.seats || '1'),
              maxSeats: parseInt(session.metadata.maxSeats || '5'),
            },
            update: {
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              plan: session.metadata.plan || 'free',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              seats: parseInt(session.metadata.seats || '1'),
              maxSeats: parseInt(session.metadata.maxSeats || '5'),
            },
          })
        } else {
          // Handle individual subscription
          await prisma.subscription.upsert({
            where: {
              userId: session.metadata?.userId!,
            },
            create: {
              userId: session.metadata?.userId!,
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              plan: session.metadata?.plan || 'free',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
            update: {
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              plan: session.metadata?.plan || 'free',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const metadata = subscription.metadata

        if (metadata?.type === 'team') {
          await prisma.teamSubscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: subscription.status,
              stripePriceId: subscription.items.data[0].price.id,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              seats: parseInt(metadata.seats || '1'),
              maxSeats: parseInt(metadata.maxSeats || '5'),
            },
          })
        } else {
          await prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: subscription.status,
              stripePriceId: subscription.items.data[0].price.id,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const metadata = subscription.metadata

        if (metadata?.type === 'team') {
          await prisma.teamSubscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: 'canceled',
              cancelAtPeriodEnd: false,
            },
          })
        } else {
          await prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: 'canceled',
              cancelAtPeriodEnd: false,
            },
          })
        }
        break
      }

      case "customer.deleted": {
        const customer = event.data.object as Stripe.Customer
        const metadata = customer.metadata

        if (metadata?.type === 'team') {
          await prisma.teamSubscription.updateMany({
            where: {
              stripeCustomerId: customer.id,
            },
            data: {
              stripeCustomerId: null,
              stripeSubscriptionId: null,
              status: 'canceled',
            },
          })
        } else {
          await prisma.subscription.updateMany({
            where: {
              stripeCustomerId: customer.id,
            },
            data: {
              stripeCustomerId: null,
              stripeSubscriptionId: null,
              status: 'canceled',
            },
          })
        }
        break
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}