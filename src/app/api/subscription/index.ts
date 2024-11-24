// pages/api/subscription/index.ts
import {NextApiRequest, NextApiResponse } from 'next';
import {getServerSession } from 'next-auth/next';
import {authOptions } from '@/lib/auth';
import {stripe } from '@/lib/stripe';
import {ApiError } from '@/lib/api-error';

interface SubscriptionResponse {
  subscription: any | null;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubscriptionResponse>
) {
  try {
    // Validate request method
    if (req.method !== 'GET') {
      throw new ApiError(405, 'Method not allowed');
    }

    // Validate authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Validate stripe customer ID
    if (!session.user.stripeCustomerId) {
      throw new ApiError(400, 'No Stripe customer ID found');
    }

    // Fetch subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: session.user.stripeCustomerId,
      status: 'active',
      expand: ['data.default_payment_method'],
      limit: 1,
    });

    return res.status(200).json({
      subscription: subscriptions.data[0] || null,
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        subscription: null,
        error: error.message,
      });
    }

    const message = error instanceof Error ? error.message : 'Failed to fetch subscription';
    return res.status(500).json({
      subscription: null,
      error: message,
    });
  }
}
