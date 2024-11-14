
// src/components/subscription/pricing-card.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface PricingCardProps {
  name: string
  description: string
  price: number
  features: string[]
  priceId: string
  popular?: boolean
}

export function PricingCard({
  name,
  description,
  price,
  features,
  priceId,
  popular
}: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      
      const { url } = await response.json()
      router.push(url)
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  function cn(arg0: string, arg1: string | boolean | undefined): string | undefined {
    throw new Error("Function not implemented.")
  }

  return (
    <Card className={cn(
      "relative flex flex-col p-6",
      popular && "border-blue-500 shadow-blue-100"
    )}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-gray-500">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-500">/month</span>
      </div>

      <ul className="mb-6 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        disabled={loading}
        className="mt-auto"
        variant={popular ? "default" : "outline"}
      >
        {loading ? "Loading..." : "Subscribe"}
      </Button>
    </Card>
  )
}