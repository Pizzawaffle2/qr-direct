// src/app/api/subscriptions/status/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      status: subscription.status,
      plan: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    })
  } catch (error) {
    console.error("Subscription status error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    )
  }
}

// src/app/api/subscriptions/usage/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SUBSCRIPTION_PLANS } from "@/config/subscription"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's subscription and current usage
    const [subscription, usage] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.usage.findFirst({
        where: {
          userId: session.user.id,
          period: {
            gte: new Date(new Date().setDate(1)), // Start of current month
          },
        },
      }),
    ])

    const plan = SUBSCRIPTION_PLANS[
      (subscription?.plan as keyof typeof SUBSCRIPTION_PLANS) || 'FREE'
    ]

    // Get team members count if applicable
    const teamMembersCount = await prisma.teamMember.count({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({
      qrCodes: {
        used: usage?.qrCodesCreated || 0,
        limit: plan.limits.qrCodes,
      },
      templates: {
        used: usage?.templatesCreated || 0,
        limit: plan.limits.templates,
      },
      storage: {
        used: usage?.storage || 0,
        limit: plan.limits.storage,
      },
      teamMembers: {
        used: teamMembersCount,
        limit: plan.limits.teamMembers,
      },
    })
  } catch (error) {
    console.error("Usage metrics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch usage metrics" },
      { status: 500 }
    )
  }
}