import Stripe from 'stripe'

// Lazy init — avoids build-time crash when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  return _stripe
}

// Convenience alias
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop]
  },
})
