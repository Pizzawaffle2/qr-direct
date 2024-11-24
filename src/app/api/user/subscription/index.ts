// pages/api/subscription/index.ts
import {NextApiRequest, NextApiResponse } from 'next';
import {getServerSession } from 'next-auth/next';
import {authOptions } from '@/lib/auth';
import {stripe } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscription = await stripe.subscriptions.list({
      customer: session.user.stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    return res.status(200).json({
      subscription: subscription.data[0] || null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch subscription' });
  }
}
