// types/user.ts
import { DefaultSession } from "next-auth"

/**
 * Defines the possible roles a user can have in the system
 */
export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

/**
 * Subscription status types
 */
export type SubscriptionStatus = 'active' | 'inactive'

/**
 * Available subscription tiers
 */
export enum SubscriptionTier {
  FREE = "free",
  PRO = "pro"
}

/**
 * Represents a user's subscription details
 */
export interface UserSubscription {
  status: SubscriptionStatus
  tier?: SubscriptionTier
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
}

/**
 * Base user properties
 */
export interface BaseUser {
  id: string
  email: string
  name?: string
  image?: string
  role: UserRole
  lastLoginAt: Date
}

/**
 * Complete user model with subscription information
 */
/**
 * Extends NextAuth Session type to include custom user properties
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      subscriptionStatus: SubscriptionStatus
    } & DefaultSession["user"]
  }
}
