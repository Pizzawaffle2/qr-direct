// src/lib/subscription.ts
import stripe from './stripe'
import { prisma } from './db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../app/api/auth/[...nextauth]/authOptions'

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business',
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS

export const TIER_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    qrCodesPerMonth: 10,
    customBranding: false,
    analytics: false,
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    qrCodesPerMonth: 100,
    customBranding: true,
    analytics: true,
  },
  [SUBSCRIPTION_TIERS.BUSINESS]: {
    qrCodesPerMonth: -1, // unlimited
    customBranding: true,
    analytics: true,
  },
}

export async function createStripeCheckoutSession(priceId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) throw new Error('Not authenticated')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) throw new Error('User not found')

  let stripeCustomerId = user.stripeCustomerId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: {
        userId: user.id,
      },
    })
    stripeCustomerId = customer.id

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
    metadata: {
      userId: user.id,
    },
  })

  return checkoutSession.url
}

export async function createStripePortalSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) throw new Error('Not authenticated')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user?.stripeCustomerId) throw new Error('No Stripe customer found')

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })

  return portalSession.url
}
