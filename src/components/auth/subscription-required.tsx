import {ReactNode } from 'react';

import {useSession } from 'next-auth/react';

import {Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SubscriptionRequiredProps {
  children: ReactNode;

  feature: string;

  plan: 'pro' | 'enterprise';
}

export function SubscriptionRequired({ children, feature, plan }: SubscriptionRequiredProps) {
  const { data: session } = useSession();

  const hasSubscription = session?.user?.subscriptionStatus === plan.toUpperCase();

  if (!hasSubscription) {
    return (
      <Alert>
        <AlertTitle>Subscription Required</AlertTitle>

        <AlertDescription>
          {feature} is only available on the {plan} plan. Please upgrade to continue.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
