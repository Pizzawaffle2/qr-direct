// types/subscription.ts
export interface Subscription {
    status: 'active' | 'canceled' | 'past_due';
    plan: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  }