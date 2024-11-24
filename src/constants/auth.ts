// src/constants/auth.ts
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_TIME_MINUTES = 30;

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
} as const;

export const SUBSCRIPTION_TIER = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;
