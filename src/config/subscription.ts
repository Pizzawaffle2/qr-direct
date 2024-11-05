// src/config/subscription.ts

export const SUBSCRIPTION_FEATURES = {
    FREE: {
      maxQRCodes: 5,
      maxStorage: 50 * 1024 * 1024, // 50MB
      features: ['Basic QR codes', 'Standard templates'],
      qrTypes: ['url', 'text', 'phone'],
      analytics: false,
      customization: false,
    },
    PRO: {
      maxQRCodes: 100,
      maxStorage: 500 * 1024 * 1024, // 500MB
      features: [
        'Advanced QR codes',
        'Custom templates',
        'Custom colors',
        'Logo insertion',
        'Basic analytics'
      ],
      qrTypes: ['url', 'text', 'phone', 'email', 'wifi', 'vcard'],
      analytics: true,
      customization: true,
    },
    ENTERPRISE: {
      maxQRCodes: -1, // Unlimited
      maxStorage: 5 * 1024 * 1024 * 1024, // 5GB
      features: [
        'Unlimited QR codes',
        'Advanced analytics',
        'API access',
        'Custom domains',
        'Priority support'
      ],
      qrTypes: ['url', 'text', 'phone', 'email', 'wifi', 'vcard', 'location'],
      analytics: true,
      customization: true,
      api: true,
    }
  }
  
  // src/lib/stripe.ts
  import Stripe from 'stripe'
  
  export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: '2023-10-16',
    typescript: true,
  })
  
  // Initialize products and prices in Stripe
  export async function initializeStripePlans() {
    // Create or update products
    const products = {
      pro: await stripe.products.create({
        name: 'Pro Plan',
        description: 'Professional features for serious users',
      }),
      enterprise: await stripe.products.create({
        name: 'Enterprise Plan',
        description: 'Advanced features for large organizations',
      }),
    }
  
    // Create prices
    await stripe.prices.create({
      product: products.pro.id,
      unit_amount: 1000, // $10.00
      currency: 'usd',
      recurring: { interval: 'month' },
    })
  
    await stripe.prices.create({
      product: products.enterprise.id,
      unit_amount: 4900, // $49.00
      currency: 'usd',
      recurring: { interval: 'month' },
    })
  }