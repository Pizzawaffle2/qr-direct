// src/app/dashboard/billing/page.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { SUBSCRIPTION_PLANS } from "@/config/subscription"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, CreditCard, Zap } from "lucide-react"
import { BillingStatus } from "./billing-status"
import { UsageMetrics } from "./usage-metrics"

export default function BillingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId)
      const response = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      window.location.href = data.url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start subscription process",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setLoading("manage")
      const response = await fetch("/api/subscriptions/portal", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      window.location.href = data.url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Subscription Status */}
      <div className="mb-10">
        <BillingStatus onManage={handleManageSubscription} loading={loading === "manage"} />
      </div>

      {/* Usage Metrics */}
      <div className="mb-10">
        <UsageMetrics />
      </div>

      {/* Subscription Plans */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative h-full p-6">
                {plan.id === "pro" && (
                  <Badge 
                    className="absolute -top-2 right-4 bg-gradient-to-r from-violet-600 to-indigo-600"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                )}

                <div className="mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.priceDisplay}</span>
                    <span className="text-muted-foreground ml-2">
                      /{plan.interval}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.id === "pro" ? "default" : "outline"}
                    disabled={loading !== null}
                    onClick={() => 
                      plan.stripePriceId 
                        ? handleSubscribe(plan.stripePriceId)
                        : handleManageSubscription()
                    }
                  >
                    {loading === plan.stripePriceId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {plan.price === 0 ? (
                          "Current Plan"
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Subscribe
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}