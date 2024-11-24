import {useState, useEffect } from 'react';
import {useSession } from 'next-auth/react';
import {PLANS } from '@/lib/config/pricing';

interface UsageData {
  qrCodes: {
    current: number;
    limit: number;
    percentage: number;
  };
  templates: {
    current: number;
    limit: number;
    percentage: number;
  };
  apiCalls: {
    current: number;
    enabled: boolean;
  };
  storage: {
    current: number;
    limit: number;
    percentage: number;
  };
  scans: {
    current: number;
    limit: number;
    percentage: number;
  };
}

export function useUsage() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/usage');
        const data = await response.json();

        const plan = PLANS.find((p) => p.id === data.subscription.plan);
        if (!plan) return;

        setUsage({
          qrCodes: {
            current: data.qrCodesCreated,
            limit: plan.limits.qrCodes,
            percentage:
              plan.limits.qrCodes === -1 ? 0 : (data.qrCodesCreated / plan.limits.qrCodes) * 100,
          },
          templates: {
            current: data.templatesCreated,
            limit: plan.limits.templates,
            percentage:
              plan.limits.templates === -1
                ? 0
                : (data.templatesCreated / plan.limits.templates) * 100,
          },
          apiCalls: {
            current: data.apiCalls,
            enabled: plan.limits.api,
          },
          storage: {
            current: data.storageUsed,
            limit: plan.limits.storage,
            percentage:
              plan.limits.storage === -1 ? 0 : (data.storageUsed / plan.limits.storage) * 100,
          },
          scans: {
            current: data.scans,
            limit: plan.limits.scanLimit,
            percentage:
              plan.limits.scanLimit === -1 ? 0 : (data.scans / plan.limits.scanLimit) * 100,
          },
        });
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, [session]);

  return { usage, isLoading };
}
