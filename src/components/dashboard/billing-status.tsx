'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import type { Subscription } from "@/types/subscription";
import { 
  CreditCard, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

interface BillingError {
  message: string;
}

export function BillingStatus() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/subscription');
        
        if (!response.ok) {
          const error = await response.json() as BillingError;
          throw new Error(error.message || 'Failed to fetch subscription');
        }
        
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to load subscription details',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [toast]);

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/subscription/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const error = await response.json() as BillingError;
        throw new Error(error.message || 'Failed to create portal session');
      }

      const data = await response.json();
      
      if (!data?.url) {
        throw new Error('No portal URL received');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to manage subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to access subscription management',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
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
              <p className="text-sm text-muted-foreground">
                You are currently on the free plan
              </p>
            </div>
          </div>
          <Button onClick={handleManageSubscription} disabled={loading}>
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
      case "active":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "canceled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "past_due":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const daysLeft = subscription.currentPeriodEnd 
    ? Math.ceil(
        (new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    : 0;

  const progressValue = Math.max(0, Math.min(100, (1 - (daysLeft / 30)) * 100));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold capitalize">{subscription.plan} Plan</h3>
            <p className="text-sm text-muted-foreground">
              {subscription.cancelAtPeriodEnd
                ? "Cancels at end of billing period"
                : subscription.currentPeriodEnd 
                  ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  : "No renewal date set"}
            </p>
          </div>
        </div>
        <Button onClick={handleManageSubscription} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Manage Subscription"
          )}
        </Button>
      </div>

      {subscription.currentPeriodEnd && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Billing period</span>
            <span>{daysLeft} days left</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      )}
    </Card>
  );
}