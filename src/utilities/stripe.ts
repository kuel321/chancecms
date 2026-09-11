import Stripe from 'stripe'
import type { BillingInvoice } from '@/payload-types'

let client: Stripe | undefined

export function invoiceStatus(status: string | null | undefined): BillingInvoice['status'] {
  switch (status) {
    case 'open':
      return 'open'
    case 'paid':
      return 'paid'
    case 'void':
      return 'void'
    case 'uncollectible':
      return 'uncollectible'
    case 'draft':
    case null:
    case undefined:
      return 'draft'
    default:
      throw new Error(`Unsupported Stripe invoice status: ${status}`)
  }
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
  client ??= new Stripe(key, { maxNetworkRetries: 2, timeout: 20000 })
  return client
}

export function billingOrigin(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000')
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('Billing requires an HTTPS NEXT_PUBLIC_SERVER_URL in production')
  }
  return url.origin
}

export function portalURL(): string | null {
  try {
    const url = new URL(process.env.STRIPE_CUSTOMER_PORTAL_URL || '')
    return url.protocol === 'https:' &&
      url.hostname === 'billing.stripe.com' &&
      url.pathname.startsWith('/p/login/')
      ? url.href
      : null
  } catch {
    return null
  }
}

export function stripeID(value: string | { id: string } | null | undefined): string | undefined {
  return typeof value === 'string' ? value : value?.id
}

export function formatPrice(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency })
  // Stripe charge units differ from ISO display decimals for currencies such as ISK and UGX.
  // https://docs.stripe.com/currencies#zero-decimal
  const zeroDecimal = [
    'bif',
    'clp',
    'djf',
    'gnf',
    'jpy',
    'kmf',
    'krw',
    'mga',
    'pyg',
    'rwf',
    'vnd',
    'vuv',
    'xaf',
    'xof',
    'xpf',
  ]
  const digits = zeroDecimal.includes(currency.toLowerCase()) ? 0 : 2
  return formatter.format(amount / 10 ** digits)
}

export function validatePrice(price: Stripe.Price): void {
  if (
    !price.active ||
    price.unit_amount === null ||
    price.unit_amount <= 0 ||
    price.billing_scheme !== 'per_unit' ||
    price.recurring?.usage_type === 'metered' ||
    price.transform_quantity ||
    (price.currency_options && Object.keys(price.currency_options).length > 0)
  ) {
    throw new Error(
      'Use an active, fixed, positive, single-currency Stripe price without quantity transforms',
    )
  }
  if (typeof price.product !== 'string' && ('deleted' in price.product || !price.product.active)) {
    throw new Error('The Stripe product must be active')
  }
}
