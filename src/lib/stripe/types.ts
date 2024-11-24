// src/lib/stripe/types.ts
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  features: string[];
  limits: {
    qrCodesPerMonth: number;
    customBranding: boolean;
    analytics: boolean;
    teamMembers: number;
  };
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: string | null;
  periodEnd: Date | null;
  isCanceled: boolean;
}
