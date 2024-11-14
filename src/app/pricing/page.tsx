// src/app/pricing/page.tsx
import { PricingCard } from "@/components/subscription/pricing-card"

const PRICING_PLANS = [
  {
    name: "Free",
    description: "For personal use",
    price: 0,
    priceId: "", // No Stripe price ID needed for free tier
    features: [
      "10 QR codes per month",
      "Basic templates",
      "Standard support"
    ]
  },
  {
    name: "Pro",
    description: "For professionals",
    price: 9,
    priceId: "price_xxx", // Add your Stripe price ID
    popular: true,
    features: [
      "100 QR codes per month",
      "Custom branding",
      "Analytics",
      "Priority support"
    ]
  },
  {
    name: "Business",
    description: "For teams",
    price: 29,
    priceId: "price_yyy", // Add your Stripe price ID
    features: [
      "Unlimited QR codes",
      "Custom branding",
      "Advanced analytics",
      "24/7 support",
      "Team management"
    ]
  }
]

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-gray-500">Choose the plan that's right for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>
    </div>
  )
}
