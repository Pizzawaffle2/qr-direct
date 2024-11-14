// src/app/api/subscription/create-checkout/route.ts
import { createStripeCheckoutSession } from '@/lib/subscription'

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json()
    const url = await createStripeCheckoutSession(priceId)
    return new Response(JSON.stringify({ url }), { status: 200 })
  } catch (error) {
    console.error('Subscription error:', error)
    return new Response('Error creating checkout session', { status: 500 })
  }
}
