import { z } from 'zod'

export const subscriptionSchema = z.object({
    // Define your subscription schema here
})

export const SUBSCRIPTION_PLANS = {
    FREE: {
        name: 'Free',
        price: 0,
        features: [
            'Basic QR codes',
            '5 QR codes per month',
            'Basic analytics'
        ]
    },
    PRO: {
        name: 'Pro',
        price: 10,
        features: [
            'Everything in Free',
            'Unlimited QR codes',
            'Advanced analytics',
            'Custom designs'
        ]
    },
    ENTERPRISE: {
        name: 'Enterprise',
        price: 49,
        features: [
            'Everything in Pro',
            'Team collaboration',
            'API access',
            'Priority support'
        ]
    }
}
