// src/types/config.ts
import { SUBSCRIPTION_PLANS, QR_CONFIG, TEAM_CONFIG, API_CONFIG } from '@/config'

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
export type PlanId = typeof SUBSCRIPTION_PLANS[SubscriptionPlan]['id']
export type QRType = keyof typeof QR_CONFIG.types
export type ErrorCorrectionLevel = typeof QR_CONFIG.errorCorrectionLevels[number]['value']
export type TeamRole = keyof typeof TEAM_CONFIG.roles
export type TeamPermission = typeof TEAM_CONFIG.roles[TeamRole]['permissions'][number]
export type ApiVersion = typeof API_CONFIG.version

export interface SubscriptionLimits {
  qrCodes: number
  templates: number
  storage: number
  analytics: 'basic' | 'advanced' | 'enterprise'
  teamMembers: number
}

export interface QRStyle {
  size: number
  margin: number
  errorCorrection: ErrorCorrectionLevel
  darkColor: string
  lightColor: string
  logo?: string
}

export interface TeamMemberInfo {
  role: TeamRole
  permissions: TeamPermission[]
  joinedAt?: Date
  invitedBy: string
}

export interface ApiRateLimitConfig {
  window: number
  max: Record<PlanId, number>
}