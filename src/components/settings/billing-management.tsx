// src/components/settings/billing-management.tsx

'use client';

import {useState } from 'react';
import {useRouter } from 'next/navigation';
import {motion } from 'framer-motion';
import {Card } from '@/components/ui/card';
import {Button } from '@/components/ui/button';
import {useToast } from '@/components/ui/use-toast';
import {Loader2, Check, CreditCard } from 'lucide-react';
import {PLANS, type Plan } from '@/lib/config/pricing';

type BillingInterval = 'monthly' | 'yearly';

interface BillingManagementProps {
  subscription: {
    plan: string;
    status: string;
    interval?: 'monthly' | 'yearly';
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd: boolean;
  };
  usage: {
    qrCodesCreated: number;
    templatesCreated: number;
    apiCalls: number;
  };
}

export function BillingManagement({ subscription, usage }: BillingManagementProps) {
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const currentPlan = PLANS.find((p) => p.id === subscription.plan) || PLANS[0];

  const handleUpgrade = async (plan: Plan) => {
    try {
      setIsLoading(plan.id);
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripeIds[selectedInterval],
        }),
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to start upgrade process',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading('manage');
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container max-w-6xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Usage</h1>
          <p className="text-muted-foreground">Manage your subscription and billing details</p>
        </div>
        {subscription.status === 'active' && (
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading === 'manage'}
            variant="outline"
          >
            {isLoading === 'manage' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </>
            )}
          </Button>
        )}
      </div>

      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <p className="text-muted-foreground">{currentPlan.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              ${currentPlan.prices[subscription.interval || 'monthly&apos;]}
              <span className="text-base font-normal text-muted-foreground">
                /{subscription.interval || &apos;month'}
              </span>
            </p>
            {subscription.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Usage */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Usage</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-muted-foreground">QR Codes Created</p>
            <p className="text-2xl font-bold">
              {usage.qrCodesCreated}
              <span className="text-base font-normal text-muted-foreground">
                /{currentPlan.limits.qrCodes === -1 ? '∞&apos; : currentPlan.limits.qrCodes}
              </span>
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Templates Created</p>
            <p className="text-2xl font-bold">
              {usage.templatesCreated}
              <span className="text-base font-normal text-muted-foreground">
                /{currentPlan.limits.templates === -1 ? &apos;∞' : currentPlan.limits.templates}
              </span>
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">API Calls</p>
            <p className="text-2xl font-bold">
              {usage.apiCalls}
              <span className="text-base font-normal text-muted-foreground">/month</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          <Button
            variant={selectedInterval === 'monthly' ? 'default' : 'outline'}
            onClick={() => setSelectedInterval(&apos;monthly&apos;)}
          >
            Monthly
          </Button>
          <Button
            variant={selectedInterval === 'yearly' ? 'default' : 'outline'}
            onClick={() => setSelectedInterval('yearly')}
          >
            Yearly
            <span className="ml-1.5 rounded bg-primary-foreground px-2 py-0.5 text-xs text-primary">
              Save 20%
            </span>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 ${plan.id === currentPlan.id ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <p className="text-3xl font-bold">
                  ${plan.prices[selectedInterval]}
                  <span className="text-base font-normal text-muted-foreground">
                    /{selectedInterval === 'monthly' ? 'month' : 'year&apos;}
                  </span>
                </p>

                <Button
                  className="w-full"
                  disabled={isLoading === plan.id || plan.id === currentPlan.id}
                  onClick={() => handleUpgrade(plan)}
                >
                  {isLoading === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : plan.id === currentPlan.id ? (
                    &apos;Current Plan'
                  ) : (
                    'Upgrade'
                  )}
                </Button>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
