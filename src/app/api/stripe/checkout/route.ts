import { getPayload } from 'payload'
import config from '@payload-config'
import { billingOrigin, getStripe, validatePrice } from '@/utilities/stripe'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const origin = billingOrigin()
    if (req.headers.get('origin') !== origin)
      return Response.json({ error: 'Invalid origin' }, { status: 403 })
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return Response.json(
        { error: 'Online payments are not available yet. Please contact us.' },
        { status: 503 },
      )
    }
    const body = await req.json().catch(() => null)
    const id = Number(body?.offerID)
    if (!Number.isSafeInteger(id) || id <= 0 || !/^[a-f0-9-]{36}$/i.test(body?.requestID ?? '')) {
      return Response.json({ error: 'Invalid checkout request' }, { status: 400 })
    }
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'billing-offers',
      overrideAccess: false,
      where: { and: [{ id: { equals: id } }, { active: { equals: true } }] },
      limit: 1,
      depth: 0,
    })
    const offer = docs[0]
    if (!offer) return Response.json({ error: 'This service is unavailable.' }, { status: 404 })
    const stripe = getStripe()
    const price = await stripe.prices.retrieve(offer.stripePriceID, { expand: ['product'] })
    validatePrice(price)
    const metadata = { source: 'chancecms', offerID: String(offer.id), offerTitle: offer.title }
    const subscription = price.type === 'recurring'
    const session = await stripe.checkout.sessions.create(
      {
        mode: subscription ? 'subscription' : 'payment',
        line_items: [{ price: price.id, quantity: 1 }],
        ...(subscription
          ? { subscription_data: { metadata } }
          : { customer_creation: 'always' as const, payment_intent_data: { metadata } }),
        metadata,
        client_reference_id: String(offer.id),
        billing_address_collection: 'required',
        ...(process.env.STRIPE_AUTOMATIC_TAX === 'true'
          ? { automatic_tax: { enabled: true } }
          : {}),
        success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/services/${offer.slug || offer.id}?canceled=1`,
      },
      { idempotencyKey: `checkout-${offer.id}-${price.id}-${body.requestID}` },
    )
    return Response.json({ url: session.url })
  } catch (error) {
    console.error(
      'Stripe checkout failed',
      error instanceof Error ? error.message : 'Unknown error',
    )
    return Response.json(
      { error: 'Unable to start checkout. Please try again shortly.' },
      { status: 502 },
    )
  }
}
