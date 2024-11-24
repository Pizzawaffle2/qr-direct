// pages/api/subscription/manage.ts
import {NextApiRequest, NextApiResponse } from 'next';
import {getServerSession } from 'next-auth/next';
import {authOptions } from '@/lib/auth';
import {stripe } from '@/lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: session.user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return res.status(200).json({ url: stripeSession.url });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
}
