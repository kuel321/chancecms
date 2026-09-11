import type Stripe from 'stripe'
import type { Payload } from 'payload'
import { invoiceStatus, stripeID } from './stripe'

export async function syncCheckout(payload: Payload, stripe: Stripe, sessionID: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionID)
  if (session.metadata?.source !== 'chancecms') return
  const intentID = stripeID(session.payment_intent)
  let status: 'paid' | 'pending' | 'failed' | 'expired' | 'refunded' | 'partially_refunded' =
    session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
      ? 'paid'
      : session.status === 'expired'
        ? 'expired'
        : 'pending'
  if (intentID) {
    const intent = await stripe.paymentIntents.retrieve(intentID, { expand: ['latest_charge'] })
    if (typeof intent.latest_charge === 'object' && intent.latest_charge) {
      const charge = intent.latest_charge
      if (charge.refunded) status = 'refunded'
      else if (charge.amount_refunded > 0) status = 'partially_refunded'
    }
    if (
      status === 'pending' &&
      (intent.status === 'canceled' ||
        (intent.status === 'requires_payment_method' && intent.last_payment_error))
    )
      status = 'failed'
  }
  const data = {
    stripeSessionID: session.id,
    offerTitle: session.metadata.offerTitle,
    customerEmail: session.customer_details?.email ?? undefined,
    stripeCustomerID: stripeID(session.customer),
    stripePaymentIntentID: intentID,
    stripeSubscriptionID: stripeID(session.subscription),
    amount: session.amount_total,
    currency: session.currency,
    status,
    livemode: session.livemode,
  }
  const existing = await payload.find({
    collection: 'billing-payments',
    where: { stripeSessionID: { equals: session.id } },
    limit: 1,
    depth: 0,
  })
  // Unique IDs make delivery retries safe; a concurrent insert can retry through Stripe.
  if (existing.docs[0])
    await payload.update({ collection: 'billing-payments', id: existing.docs[0].id, data })
  else await payload.create({ collection: 'billing-payments', data })
  if (data.stripeSubscriptionID) await syncSubscription(payload, stripe, data.stripeSubscriptionID)
}

export async function syncSubscription(payload: Payload, stripe: Stripe, id: string) {
  // Read current Stripe state so a late webhook does not replay an old snapshot.
  const subscription = await stripe.subscriptions.retrieve(id)
  if (subscription.metadata.source !== 'chancecms') return
  const data = {
    stripeSubscriptionID: subscription.id,
    stripeCustomerID: stripeID(subscription.customer)!,
    stripePriceID: subscription.items.data[0]?.price.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    livemode: subscription.livemode,
  }
  const existing = await payload.find({
    collection: 'billing-subscriptions',
    where: { stripeSubscriptionID: { equals: id } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0])
    await payload.update({ collection: 'billing-subscriptions', id: existing.docs[0].id, data })
  else await payload.create({ collection: 'billing-subscriptions', data })
}

export async function handleStripeEvent(payload: Payload, stripe: Stripe, event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.async_payment_failed':
    case 'checkout.session.expired':
      await syncCheckout(payload, stripe, event.data.object.id)
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await syncSubscription(payload, stripe, event.data.object.id)
      break
    case 'invoice.paid':
    case 'invoice.payment_failed':
    case 'invoice.finalized':
    case 'invoice.voided':
    case 'invoice.marked_uncollectible': {
      const invoice = await stripe.invoices.retrieve(event.data.object.id)
      if (invoice.metadata?.source === 'chancecms' && invoice.metadata.invoiceRequestID) {
        await payload.update({
          collection: 'billing-invoices',
          where: {
            and: [
              { id: { equals: Number(invoice.metadata.invoiceRequestID) } },
              { stripeInvoiceID: { equals: invoice.id } },
            ],
          },
          data: {
            status: invoiceStatus(invoice.status),
            hostedInvoiceURL: invoice.hosted_invoice_url,
          },
        })
      }
      const subscriptionID = stripeID(invoice.parent?.subscription_details?.subscription)
      if (subscriptionID) await syncSubscription(payload, stripe, subscriptionID)
      break
    }
    case 'charge.refunded': {
      const intentID = stripeID(event.data.object.payment_intent)
      if (!intentID) break
      const sessions = await stripe.checkout.sessions.list({ payment_intent: intentID, limit: 1 })
      for (const session of sessions.data) await syncCheckout(payload, stripe, session.id)
      break
    }
  }
}
