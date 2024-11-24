// src/types/user.ts
import {USER_ROLE, SUBSCRIPTION_STATUS, SUBSCRIPTION_TIER } from '@/constants/user';

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];
export type SubscriptionTier = (typeof SUBSCRIPTION_TIER)[keyof typeof SUBSCRIPTION_TIER];

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier?: SubscriptionTier;
  stripeCustomerId?: string | null;
  emailVerified?: Date | null;
  lastLoginAt?: Date;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
}

// Add guards for type checking
export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLE).includes(role as UserRole);
};

export const isValidSubscriptionStatus = (status: string): status is SubscriptionStatus => {
  return Object.values(SUBSCRIPTION_STATUS).includes(status as SubscriptionStatus);
};

export const isValidSubscriptionTier = (tier: string): tier is SubscriptionTier => {
  return Object.values(SUBSCRIPTION_TIER).includes(tier as SubscriptionTier);
};
