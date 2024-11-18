// types/user.ts
import { DefaultSession } from "next-auth";

export type UserRole = 'user' | 'admin';

export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'cancelled';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface UserSubscription {
  status: SubscriptionStatus;
  tier?: SubscriptionTier;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface User {
  id: string;
  email: string;
  emailVerified?: Date;
  name?: string;
  image?: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier?: SubscriptionTier;
  subscription?: UserSubscription;
  stripeCustomerId?: string; // Ensure this property is included
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      subscriptionStatus: SubscriptionStatus;
      subscriptionTier?: SubscriptionTier;
      stripeCustomerId?: string;
    } & DefaultSession["user"]
  }
}