import 'dotenv/config'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '../src/payload.config'

if (
  !process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ||
  process.env.DATABASE_URL !== 'file:./.tmp/stripe-sandbox.db'
) {
  throw new Error('Use the Stripe test key and isolated .tmp/stripe-sandbox.db only')
}
const origin = process.env.STRIPE_SANDBOX_ORIGIN || 'http://localhost:3002'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const payload = await getPayload({ config })
const setup = JSON.parse(fs.readFileSync('.tmp/stripe-sandbox.json', 'utf8')) as {
  offers: { kind: string; title: string; priceID: string }[]
}
const waitFor = async (label: string, check: () => Promise<boolean>) => {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await check()) {
      console.log(`PASS ${label}`)
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error(`Timed out: ${label}`)
}
try {
  const email = 'billing-sandbox-admin@example.com'
  const password = randomUUID()
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  const user = existing.docs[0]
    ? await payload.update({ collection: 'users', id: existing.docs[0].id, data: { password } })
    : await payload.create({
        collection: 'users',
        data: { email, password, name: 'Billing sandbox admin' },
      })
  const login = await payload.login({ collection: 'users', data: { email, password } })
  fs.writeFileSync('.tmp/stripe-sandbox-admin.json', JSON.stringify({ email, password }, null, 2))
  const offers = []
  for (const item of setup.offers) {
    const found = await payload.find({
      collection: 'billing-offers',
      where: { stripePriceID: { equals: item.priceID } },
      limit: 1,
    })
    offers.push(
      found.docs[0] ??
        (await payload.create({
          collection: 'billing-offers',
          user,
          overrideAccess: false,
          data: {
            title: item.title,
            description: 'Sandbox example. No real payment will be taken.',
            stripePriceID: item.priceID,
            active: true,
          },
        })),
    )
  }
  const services = await fetch(`${origin}/services`)
  assert.equal(services.status, 200)
  const html = await services.text()
  assert.ok(html.includes('Sandbox service') && html.includes('$5.00') && html.includes('$10.00'))
  assert.equal((await fetch(`${origin}/billing`)).status, 200)
  console.log('PASS services show actual Stripe prices; billing page responds')

  for (const offer of offers) {
    const requestID = randomUUID()
    const checkout = async () => {
      const response = await fetch(`${origin}/api/stripe/checkout`, {
        method: 'POST',
        headers: { origin, 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerID: offer.id, requestID }),
      })
      assert.equal(response.status, 200, await response.clone().text())
      return response.json() as Promise<{ url: string }>
    }
    const first = await checkout()
    assert.equal((await checkout()).url, first.url)
    console.log(`PASS ${offer.title}: Checkout session created and retry reused it`)
  }

  const invoice = await payload.create({
    collection: 'billing-invoices',
    user,
    overrideAccess: false,
    data: {
      title: 'Sandbox integration verification',
      customerName: 'Sandbox client',
      customerEmail: 'billing-sandbox-client@example.com',
      amount: 500,
      kind: 'deposit',
      daysUntilDue: 7,
    },
  })
  assert.ok(invoice.operationKey, 'Server must generate the immutable invoice operation key')
  const endpoint = `${origin}/api/billing-invoices/${invoice.id}/create-stripe-invoice`
  const anonymous = await fetch(endpoint, { method: 'POST', headers: { origin } })
  assert.equal(anonymous.status, 401)
  const generate = async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { origin, Authorization: `JWT ${login.token}` },
    })
    assert.equal(response.status, 200, await response.clone().text())
    return response.json() as Promise<{ url: string }>
  }
  const firstInvoice = await generate()
  assert.equal((await generate()).url, firstInvoice.url)
  const generated = await payload.findByID({ collection: 'billing-invoices', id: invoice.id })
  assert.ok(generated.stripeInvoiceID && generated.stripeCustomerID)
  assert.equal((await stripe.invoices.listLineItems(generated.stripeInvoiceID)).data.length, 1)
  console.log('PASS admin-only invoice creation, default key, and retry without duplicate lines')
  await assert.rejects(
    payload.update({
      collection: 'billing-invoices',
      id: invoice.id,
      user,
      overrideAccess: false,
      data: { amount: 600 },
    }),
  )
  await assert.rejects(payload.find({ collection: 'billing-invoices', overrideAccess: false }))
  console.log('PASS issued invoice details are immutable and private records reject public access')

  const method = await stripe.paymentMethods.create({ type: 'card', card: { token: 'tok_visa' } })
  await stripe.paymentMethods.attach(method.id, { customer: generated.stripeCustomerID })
  await stripe.invoices.pay(generated.stripeInvoiceID, { payment_method: method.id })
  await waitFor(
    'real Stripe invoice.paid webhook updates the admin record',
    async () =>
      (await payload.findByID({ collection: 'billing-invoices', id: invoice.id })).status ===
      'paid',
  )

  const plan = setup.offers.find((offer) => offer.kind === 'plan')!
  const subscription = await stripe.subscriptions.create({
    customer: generated.stripeCustomerID,
    default_payment_method: method.id,
    items: [{ price: plan.priceID }],
    payment_behavior: 'error_if_incomplete',
    metadata: { source: 'chancecms', purpose: 'sandbox-verification' },
  })
  try {
    await waitFor('real subscription webhook creates an active subscription record', async () => {
      const records = await payload.find({
        collection: 'billing-subscriptions',
        where: { stripeSubscriptionID: { equals: subscription.id } },
      })
      return records.docs[0]?.status === 'active'
    })
  } finally {
    await stripe.subscriptions.cancel(subscription.id)
  }
  await waitFor('real cancellation webhook updates subscription status', async () => {
    const records = await payload.find({
      collection: 'billing-subscriptions',
      where: { stripeSubscriptionID: { equals: subscription.id } },
    })
    return records.docs[0]?.status === 'canceled'
  })
  console.log(
    'Sandbox verification complete. Test subscription canceled; test invoice and audit records retained.',
  )
} finally {
  await payload.destroy()
}
