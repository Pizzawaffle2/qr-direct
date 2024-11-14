import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Up to 10 QR codes',
      'Basic analytics',
      'Standard templates',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '29',
    description: 'Best for professionals',
    features: [
      'Unlimited QR codes',
      'Advanced analytics',
      'Custom templates',
      'Priority support',
      'Custom branding',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'SLA guarantees',
      'Custom integrations',
      'Team management',
      'Advanced security',
    ],
  },
];

export function PricingSection() {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="p-8 rounded-lg bg-white/5 border border-white/10 space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-400">{plan.description}</p>
            </div>

            <div className="text-4xl font-bold text-white">
              ${plan.price}
              {plan.price !== 'Custom' && <span className="text-lg">/mo</span>}
            </div>

            <ul className="space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-blue-400 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button className="w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'}>
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}