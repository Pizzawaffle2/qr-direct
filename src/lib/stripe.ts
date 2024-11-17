import Stripe from 'stripe';

if (!process.env.STRIPE_API_KEY) {
  throw new Error('Missing STRIPE_API_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const getSubscriptionPlan = (priceId: string | undefined) => {
  // Match price IDs to plan names
  switch (priceId) {
    case process.env.STRIPE_PRO_PRICE_ID:
      return 'pro';
    case process.env.STRIPE_ENTERPRISE_PRICE_ID:
      return 'enterprise';
    default:
      return 'free';
  }
};

export async function updateUserSubscriptionStatus(
  userId: string, 
  subscription: Stripe.Subscription
) {
  const { user } = await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: subscription.status,
      subscriptionTier: getSubscriptionPlan(subscription.items.data[0]?.price.id),
      subscriptionId: subscription.id,
      subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    include: { subscription: true },
  });

  return user;
}

export function determineSubscriptionTier(priceId: string): 'free' | 'pro' | 'enterprise' {
    switch (priceId) {
      case process.env.STRIPE_PRO_PRICE_ID:
        return 'pro';
      case process.env.STRIPE_ENTERPRISE_PRICE_ID:
        return 'enterprise';
      default:
        return 'free';
    }
  }
  
  export async function getSubscriptionTierFromSession(
    session: Stripe.Checkout.Session,
    stripe: Stripe
  ): Promise<'free' | 'pro' | 'enterprise'> {
    try {
      if (!session.subscription) return 'free';
  
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0]?.price.id;
      
      return determineSubscriptionTier(priceId);
    } catch (error) {
      console.error('Error determining subscription tier:', error);
      return 'free';
    }
  }