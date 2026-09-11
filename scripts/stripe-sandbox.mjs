import 'dotenv/config'
import Stripe from 'stripe'
import fs from 'node:fs'

if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))
  throw new Error('This script only accepts sandbox keys')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const account = await stripe.accounts.retrieve()
const setup = { accountID: account.id, offers: [] }
for (const [kind, name, amount] of [
  ['service', 'Sandbox service (test only)', 500],
  ['plan', 'Sandbox monthly plan (test only)', 1000],
]) {
  const lookup_key = `chancecms_sandbox_${kind}`
  const existing = await stripe.prices.list({ lookup_keys: [lookup_key], active: true, limit: 1 })
  let price = existing.data[0]
  if (!price) {
    const product = await stripe.products.create(
      { name, metadata: { source: 'chancecms-sandbox' } },
      { idempotencyKey: `chancecms-sandbox-product-${kind}` },
    )
    price = await stripe.prices.create(
      {
        product: product.id,
        unit_amount: amount,
        currency: 'usd',
        lookup_key,
        ...(kind === 'plan' ? { recurring: { interval: 'month' } } : {}),
      },
      { idempotencyKey: `chancecms-sandbox-price-${kind}` },
    )
  }
  setup.offers.push({ kind, title: name, priceID: price.id })
}
const configurations = await stripe.billingPortal.configurations.list({ limit: 100 })
let portal = configurations.data.find((item) => item.metadata.source === 'chancecms-sandbox')
if (!portal)
  portal = await stripe.billingPortal.configurations.create(
    {
      business_profile: { headline: 'Chasing a Chance sandbox billing' },
      features: {
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        customer_update: { enabled: true, allowed_updates: ['email', 'address'] },
        subscription_cancel: { enabled: true, mode: 'at_period_end' },
      },
      login_page: { enabled: true },
      metadata: { source: 'chancecms-sandbox' },
    },
    { idempotencyKey: 'chancecms-sandbox-portal' },
  )
if (!portal.login_page.url) throw new Error('Stripe did not provide a portal login URL')
setup.portalURL = portal.login_page.url
let env = fs.readFileSync('.env', 'utf8')
env = /^STRIPE_CUSTOMER_PORTAL_URL=.*$/m.test(env)
  ? env.replace(/^STRIPE_CUSTOMER_PORTAL_URL=.*$/m, `STRIPE_CUSTOMER_PORTAL_URL=${setup.portalURL}`)
  : `${env}\nSTRIPE_CUSTOMER_PORTAL_URL=${setup.portalURL}\n`
fs.writeFileSync('.env', env)
fs.mkdirSync('.tmp', { recursive: true })
fs.writeFileSync('.tmp/stripe-sandbox.json', JSON.stringify(setup, null, 2))
console.log(
  'Sandbox connected. Two test prices and an email-login portal are ready; IDs saved under .tmp.',
)
