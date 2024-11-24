'use client';

import {Button } from '@/components/ui/button';
import {motion } from 'framer-motion';
import {Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'Basic QR code generation',
      'Standard templates',
      'Basic analytics',
      'PNG downloads',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$14',
    period: 'per month',
    description: 'Best for professionals',
    features: [
      'Everything in Basic',
      'Custom design options',
      'Advanced analytics',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: ['Everything in Pro', 'Custom branding', 'API access', 'Custom integrations'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <div className="py-12">
      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-3xl font-bold sm:text-4xl"
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-muted-foreground"
        >
          Choose the perfect plan for your needs. All plans include core features.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative rounded-lg border ${
              plan.popular ? 'border-blue-500 shadow-blue-500/25' : ''
            } bg-card p-8 shadow-lg`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold">
                  Most Popular
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground"> {plan.period}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <ul className="mb-6 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-3 h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
              <Link href="/signup">{plan.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
