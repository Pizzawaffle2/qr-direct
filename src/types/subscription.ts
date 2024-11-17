export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'unpaid';

export type SubscriptionPlan = 
  | 'basic'
  | 'pro'
  | 'enterprise'
  | 'free';

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelAt?: string | null;
  canceledAt?: string | null;
  endedAt?: string | null;
  trialStart?: string | null;
  trialEnd?: string | null;
  metadata?: Record<string, any>;
}

// Response type for the subscription management endpoint
export interface SubscriptionManagementResponse {
  url: string;
}

// Error response type
export interface SubscriptionError {
  message: string;
  code?: string;
}