// src/types/auth.ts
import { DefaultSession } from 'next-auth';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface ExtendedUser {
  id: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string | null;
  subscriptionTier?: string | null;
}

export interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    stripeCustomerId?: string | null;
    subscriptionTier?: string | null;
  } & DefaultSession["user"]
}