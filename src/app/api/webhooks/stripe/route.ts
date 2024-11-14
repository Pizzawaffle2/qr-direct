
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})
import { prisma } from '@/lib/db/prisma'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = headers()
  const signature = (await headersList).get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            subscriptionStatus: subscription.status,
            subscriptionTier: subscription.items.data[0].price.lookup_key,
            subscriptionId: subscription.id,
            subscriptionCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        })
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          where: {
            stripeCustomerId: deletedSubscription.customer as string,
          },
          data: {
            subscriptionStatus: 'canceled',
            subscriptionTier: null,
            subscriptionId: null,
            subscriptionCurrentPeriodEnd: null,
          },
        })
        break
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return new Response('Webhook Error', { status: 400 })
  }
}
