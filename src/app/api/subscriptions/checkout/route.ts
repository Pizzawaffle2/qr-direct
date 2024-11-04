// src/app/api/subscriptions/checkout/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SubscriptionService } from "@/services/subscription-service"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      )
    }

    const checkoutSession = await SubscriptionService.createCheckoutSession(
      session.user.id,
      priceId
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.statusCode || 500 }
    )
  }
}

// src/app/api/subscriptions/portal/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SubscriptionService } from "@/services/subscription-service"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const portalSession = await SubscriptionService.createBillingPortalSession(
      session.user.id
    )

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error("Portal error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.statusCode || 500 }
    )
  }
}

// src/app/api/subscriptions/webhook/route.ts

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
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

  const session = event.data.object as Stripe.Checkout.Session

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.subscription.upsert({
          where: {
            userId: session.metadata?.userId!,
          },
          create: {
            userId: session.metadata?.userId!,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          update: {
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: "canceled",
            cancelAtPeriodEnd: false,
          },
        })
        break
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}