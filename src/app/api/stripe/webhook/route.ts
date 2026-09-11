import { getPayload } from 'payload'
import type Stripe from 'stripe'
import config from '@payload-config'
import { getStripe } from '@/utilities/stripe'
import { handleStripeEvent } from '@/utilities/stripeSync'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !process.env.STRIPE_SECRET_KEY)
    return Response.json({ error: 'Webhook is not configured' }, { status: 503 })
  const signature = req.headers.get('stripe-signature')
  if (!signature) return Response.json({ error: 'Missing signature' }, { status: 400 })
  const stripe = getStripe()
  let event: Stripe.Event
  try {
    // Signature verification requires the untouched request body.
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }
  try {
    const payload = await getPayload({ config })
    await handleStripeEvent(payload, stripe, event)
    return Response.json({ received: true })
  } catch (error) {
    console.error(
      'Stripe event processing failed',
      event.id,
      error instanceof Error ? error.message : 'Unknown error',
    )
    // Non-2xx makes Stripe retry; never acknowledge a failed database write.
    return Response.json({ error: 'Unable to process event' }, { status: 500 })
  }
}
