// src/lib/subscription.ts

import { prisma } from "@/lib/db"

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise'

interface SubscriptionLimits {
  maxQRCodes: number
  maxTemplates: number
  maxStorage: number // in bytes
  maxTeamMembers: number
  maxApiCalls: number
  features: string[]
}

const PLAN_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> = {
  free: {
    maxQRCodes: 5,
    maxTemplates: 1,
    maxStorage: 5 * 1024 * 1024, // 5MB
    maxTeamMembers: 1,
    maxApiCalls: 100,
    features: ['basic_qr', 'basic_analytics'],
  },
  pro: {
    maxQRCodes: 100,
    maxTemplates: 10,
    maxStorage: 100 * 1024 * 1024, // 100MB
    maxTeamMembers: 5,
    maxApiCalls: 10000,
    features: ['basic_qr', 'custom_design', 'advanced_analytics', 'api_access'],
  },
  enterprise: {
    maxQRCodes: -1, // unlimited
    maxTemplates: -1,
    maxStorage: 1024 * 1024 * 1024, // 1GB
    maxTeamMembers: -1,
    maxApiCalls: -1,
    features: ['basic_qr', 'custom_design', 'advanced_analytics', 'api_access', 'priority_support', 'custom_domain'],
  },
}

export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) {
    return {
      ...PLAN_LIMITS.free,
      plan: 'free' as SubscriptionPlan,
      isActive: true,
    }
  }

  const isActive = 
    subscription.status === "active" && 
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd.getTime() > Date.now()

  return {
    ...subscription,
    ...PLAN_LIMITS[subscription.plan as SubscriptionPlan],
    isActive,
  }
}

export async function getTeamSubscription(teamId: string) {
  const subscription = await prisma.teamSubscription.findUnique({
    where: { teamId },
  })

  if (!subscription) {
    return {
      ...PLAN_LIMITS.free,
      plan: 'free' as SubscriptionPlan,
      isActive: true,
    }
  }

  const isActive = 
    subscription.status === "active" && 
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd.getTime() > Date.now()

  return {
    ...subscription,
    ...PLAN_LIMITS[subscription.plan as SubscriptionPlan],
    isActive,
  }
}

export async function canPerformAction(
  userId: string | undefined,
  teamId: string | undefined,
  action: keyof SubscriptionLimits
) {
  if (!userId && !teamId) return false

  const subscription = teamId 
    ? await getTeamSubscription(teamId)
    : await getUserSubscription(userId!)

  if (!subscription.isActive) return false

  const currentUsage = await prisma.usage.findFirst({
    where: {
      OR: [
        { userId: userId || undefined },
        { teamId: teamId || undefined },
      ],
      period: {
        gte: new Date(new Date().setDate(1)), // Start of current month
      },
    },
  })

  if (!currentUsage) return true

  switch (action) {
    case 'maxQRCodes':
      return subscription.maxQRCodes === -1 || currentUsage.qrCodesCreated < subscription.maxQRCodes
    case 'maxTemplates':
      return subscription.maxTemplates === -1 || currentUsage.templatesCreated < subscription.maxTemplates
    case 'maxStorage':
      return subscription.maxStorage === -1 || currentUsage.storage < subscription.maxStorage
    case 'maxApiCalls':
      return subscription.maxApiCalls === -1 || currentUsage.apiCalls < subscription.maxApiCalls
    default:
      return false
  }
}

export async function incrementUsage(
  userId: string | undefined,
  teamId: string | undefined,
  action: keyof Pick<Usage, 'qrCodesCreated' | 'templatesCreated' | 'apiCalls' | 'storage' | 'scans'>,
  amount: number = 1
) {
  if (!userId && !teamId) return

  const period = new Date(new Date().setDate(1)) // Start of current month

  await prisma.usage.upsert({
    where: {
      userId_teamId_period: {
        userId: userId || null,
        teamId: teamId || null,
        period,
      },
    },
    create: {
      userId: userId || null,
      teamId: teamId || null,
      period,
      [action]: amount,
    },
    update: {
      [action]: {
        increment: amount,
      },
    },
  })
}