import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import type { Subscription } from '@/types/subscription';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // If no Stripe subscription exists, return basic info
    if (!user.subscriptionId) {
      return NextResponse.json({
        id: 'free',
        status: user.subscriptionStatus || 'inactive',
        plan: user.subscriptionTier || 'free',
        currentPeriodStart: null,
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd?.toISOString() || null,
        cancelAtPeriodEnd: false,
      });
    }

    // Fetch latest subscription data from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      user.subscriptionId
    );

    // Map Stripe subscription to our Subscription type
    const subscription: Subscription = {
      id: stripeSubscription.id,
      status: stripeSubscription.status as Subscription['status'],
      plan: user.subscriptionTier || 'free',
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      cancelAt: stripeSubscription.cancel_at 
        ? new Date(stripeSubscription.cancel_at * 1000).toISOString()
        : null,
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000).toISOString()
        : null,
      endedAt: stripeSubscription.ended_at
        ? new Date(stripeSubscription.ended_at * 1000).toISOString()
        : null,
      metadata: stripeSubscription.metadata
    };

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}