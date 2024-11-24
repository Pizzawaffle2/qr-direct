import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { StripeService } from '@/lib/services/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { priceId } = await req.json();
    if (!priceId) {
      return new NextResponse('Price ID is required', { status: 400 });
    }

    const checkoutSession = await StripeService.createCheckoutSession(session.user.id, priceId);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
