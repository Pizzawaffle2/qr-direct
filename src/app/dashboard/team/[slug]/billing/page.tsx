"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  CreditCard,
  Download,
  Loader2,
  Package,
  Users,
} from "lucide-react"
import { PLANS } from "@/lib/config/pricing"
import { useTeam } from "@/hooks/use-team"
import { formatDate } from "@/lib/utils"

export default function TeamBillingPage({
  params,
}: {
  params: { slug: string }
}) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { team, teamUsage } = useTeam(params.slug)

  if (!team) return null

  const currentPlan = PLANS.find((p) => p.id === team.subscription?.plan) || PLANS[0]

  const handleUpgrade = async (priceId: string) => {
    try {
      setIsLoading(priceId)
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          teamId: team.id,
        }),
      })

      const { url } = await response.json()
      router.push(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start upgrade process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setIsLoading("manage")
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id }),
      })

      const { url } = await response.json()
      router.push(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Billing</h1>
          <p className="text-muted-foreground">
            Manage your team's subscription and billing details
          </p>
        </div>
        {team.subscription?.status === "active" && (
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading === "manage"}
          >
            {isLoading === "manage" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </>
            )}
          </Button>
        )}
      </div>

      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <p className="text-muted-foreground mt-1">
              {currentPlan.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              ${currentPlan.prices.monthly}
              <span className="text-base font-normal text-muted-foreground">
                /month
              </span>
            </p>
            {team.subscription?.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground mt-1">
                Next billing date: {formatDate(team.subscription.currentPeriodEnd)}
              </p>
            )}
          </div>
        </div>

        {/* Current Usage */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Team Members</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {teamUsage?.activeMembers}
              <span className="text-base font-normal text-muted-foreground">
                /{currentPlan.limits.teamMembers === -1 ? '∞' : currentPlan.limits.teamMembers}
              </span>
            </p>
            <div className="mt-2 w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  teamUsage?.activeMembers === currentPlan.limits.teamMembers
                    ? 'bg-red-500'
                    : 'bg-primary'
                }`}
                style={{
                  width:
                    currentPlan.limits.teamMembers === -1
                      ? '0%'
                      : `${(teamUsage?.activeMembers / currentPlan.limits.teamMembers) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">QR Codes</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {teamUsage?.qrCodesCreated}
              <span className="text-base font-normal text-muted-foreground">
                /{currentPlan.limits.qrCodes === -1 ? '∞' : currentPlan.limits.qrCodes}
              </span>
            </p>
            <div className="mt-2 w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  teamUsage?.qrCodesCreated === currentPlan.limits.qrCodes
                    ? 'bg-red-500'
                    : 'bg-primary'
                }`}
                style={{
                  width:
                    currentPlan.limits.qrCodes === -1
                      ? '0%'
                      : `${(teamUsage?.qrCodesCreated / currentPlan.limits.qrCodes) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Billing Status</h3>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  team.subscription?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {team.subscription?.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Plans */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`p-6 ${
                plan.id === currentPlan.id
                  ? 'border-primary'
                  : ''
              }`}>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>

                <div className="mt-4">
                  <p className="text-3xl font-bold">
                    ${plan.prices.monthly}
                    <span className="text-base font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${plan.prices.yearly}/year (Save ${plan.prices.monthly * 12 - plan.prices.yearly})
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-2">
                      <svg
                        className={`h-4 w-4 ${
                          feature.enabled ? 'text-primary' : 'text-muted-foreground'
                        }`}
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {feature.enabled ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        )}
                      </svg>
                      <span className={feature.enabled ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-6"
                  variant={plan.id === currentPlan.id ? 'outline' : 'default'}
                  disabled={
                    isLoading === plan.stripeIds.monthly ||
                    plan.id === currentPlan.id
                  }
                  onClick={() => handleUpgrade(plan.stripeIds.monthly)}
                >
                  {isLoading === plan.stripeIds.monthly ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : plan.id === currentPlan.id ? (
                    'Current Plan'
                  ) : (
                    'Upgrade'
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Description</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teamUsage?.invoices?.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="py-4">{formatDate(invoice.date)}</td>
                  <td className="py-4">{invoice.description}</td>
                  <td className="py-4">${invoice.amount}</td>
                  <td className="py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(invoice.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}