'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Loader2, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BillingStatusProps {
  onManage: () => void;
  loading?: boolean;
}

interface SubscriptionDetails {
  status: string;
  plan: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export function BillingStatus({ onManage, loading }: BillingStatusProps) {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscriptions/status');
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">No Active Subscription</h3>
              <p className="text-sm text-muted-foreground">You are currently on the free plan</p>
            </div>
          </div>
          <Button onClick={onManage} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (subscription.status) {
      case 'active':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'canceled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'past_due':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const daysLeft = Math.ceil(
    (new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const progressValue = (1 - daysLeft / 30) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold capitalize">{subscription.plan} Plan</h3>
            <p className="text-sm text-muted-foreground">
              {subscription.cancelAtPeriodEnd
                ? 'Cancels at end of billing period'
                : `Renews ${format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}`}
            </p>
          </div>
        </div>
        <Button onClick={onManage} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Manage Subscription'}
        </Button>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Billing period</span>
          <span>{daysLeft} days left</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>
    </Card>
  );
}
