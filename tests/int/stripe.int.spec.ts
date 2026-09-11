// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import Stripe from 'stripe'
import type { Payload, PayloadRequest } from 'payload'

const mocks = vi.hoisted(() => ({
  payload: {
    find: vi.fn(),
    findByID: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    logger: { error: vi.fn() },
  },
  stripe: {
    prices: { retrieve: vi.fn() },
    checkout: { sessions: { create: vi.fn(), retrieve: vi.fn(), list: vi.fn() } },
    paymentIntents: { retrieve: vi.fn() },
    subscriptions: { retrieve: vi.fn() },
    customers: { list: vi.fn(), create: vi.fn() },
    invoices: {
      create: vi.fn(),
      retrieve: vi.fn(),
      listLineItems: vi.fn(),
      finalizeInvoice: vi.fn(),
    },
    invoiceItems: { create: vi.fn() },
    webhooks: { constructEvent: vi.fn() },
  },
}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', async (original) => ({
  ...(await original<typeof import('payload')>()),
  getPayload: vi.fn(async () => mocks.payload),
}))
vi.mock('@/utilities/stripe', async (original) => ({
  ...(await original<typeof import('@/utilities/stripe')>()),
  getStripe: () => mocks.stripe,
}))

import { POST as checkout } from '@/app/api/stripe/checkout/route'
import { POST as webhook } from '@/app/api/stripe/webhook/route'
import { createInvoiceEndpoint } from '@/endpoints/createInvoice'
import { handleStripeEvent, syncCheckout } from '@/utilities/stripeSync'
import { formatPrice, portalURL, validatePrice } from '@/utilities/stripe'
import { invoicePayPath, readPublicInvoice } from '@/utilities/invoiceLink'

const requestID = '0d617333-406a-46b2-8491-406bcb674ea1'
const price = {
  id: 'price_test',
  product: { active: true },
  active: true,
  unit_amount: 25000,
  currency: 'usd',
  type: 'one_time',
  billing_scheme: 'per_unit',
  recurring: null,
}
const payload = mocks.payload as unknown as Payload
const stripe = mocks.stripe as unknown as Stripe
const request = (body: unknown, origin = 'http://localhost:3000') =>
  new Request('http://localhost:3000/api/stripe/checkout', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'http://localhost:3000')
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_not_a_real_key')
  vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_local_test')
  vi.stubEnv('STRIPE_AUTOMATIC_TAX', 'false')
  vi.stubEnv('PAYLOAD_SECRET', 'test-only-invoice-link-signing-secret')
  mocks.payload.find.mockResolvedValue({
    docs: [{ id: 1, title: 'Design', active: true, stripePriceID: 'price_test' }],
  })
  mocks.stripe.prices.retrieve.mockResolvedValue(price)
  mocks.stripe.checkout.sessions.create.mockResolvedValue({
    url: 'https://checkout.stripe.com/test',
  })
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('server-controlled checkout', () => {
  it('rejects a foreign origin before contacting Stripe', async () => {
    expect(
      (await checkout(request({ offerID: 1, requestID }, 'https://attacker.example'))).status,
    ).toBe(403)
    expect(mocks.stripe.prices.retrieve).not.toHaveBeenCalled()
  })
  it('fails closed until the webhook is configured', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', '')
    expect((await checkout(request({ offerID: 1, requestID }))).status).toBe(503)
  })
  it('ignores browser-supplied prices, totals, and redirect URLs', async () => {
    const response = await checkout(
      request({
        offerID: 1,
        requestID,
        price: 'price_cheap',
        amount: 1,
        success_url: 'https://attacker.example',
      }),
    )
    expect(response.status).toBe(200)
    expect(mocks.payload.find).toHaveBeenCalledWith(
      expect.objectContaining({ overrideAccess: false }),
    )
    expect(mocks.stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: 'price_test', quantity: 1 }],
        mode: 'payment',
        success_url: 'http://localhost:3000/billing/success?session_id={CHECKOUT_SESSION_ID}',
      }),
      { idempotencyKey: `checkout-1-price_test-${requestID}` },
    )
  })
  it('uses subscription mode for recurring prices and consistent retry keys', async () => {
    mocks.stripe.prices.retrieve.mockResolvedValue({
      ...price,
      type: 'recurring',
      recurring: { interval: 'month', interval_count: 1, usage_type: 'licensed' },
    })
    await checkout(request({ offerID: 1, requestID }))
    await checkout(request({ offerID: 1, requestID }))
    expect(mocks.stripe.checkout.sessions.create.mock.calls[0][0].mode).toBe('subscription')
    expect(mocks.stripe.checkout.sessions.create.mock.calls[0][1]).toEqual(
      mocks.stripe.checkout.sessions.create.mock.calls[1][1],
    )
  })
  it('does not checkout an unpublished or missing offer', async () => {
    mocks.payload.find.mockResolvedValue({ docs: [] })
    expect((await checkout(request({ offerID: 1, requestID }))).status).toBe(404)
    expect(mocks.stripe.checkout.sessions.create).not.toHaveBeenCalled()
  })
  it('rejects unsupported or inactive Stripe prices', () => {
    for (const patch of [
      { active: false },
      { unit_amount: null },
      { unit_amount: 0 },
      { billing_scheme: 'tiered' },
      { recurring: { usage_type: 'metered' } },
    ]) {
      expect(() => validatePrice({ ...price, ...patch } as unknown as Stripe.Price)).toThrow()
    }
  })
})

describe('signed Stripe events', () => {
  const sdk = new Stripe('sk_test_fake')
  const signed = (event: object, tamper = false) => {
    const body = JSON.stringify(event)
    const signature = sdk.webhooks.generateTestHeaderString({
      payload: body,
      secret: 'whsec_local_test',
    })
    return new Request('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': signature },
      body: tamper ? body + ' ' : body,
    })
  }
  beforeEach(() => {
    mocks.stripe.webhooks.constructEvent.mockImplementation(
      sdk.webhooks.constructEvent.bind(sdk.webhooks),
    )
  })
  it('rejects unsigned and tampered requests', async () => {
    expect(
      (await webhook(new Request('http://localhost/webhook', { method: 'POST', body: '{}' })))
        .status,
    ).toBe(400)
    expect(
      (await webhook(signed({ id: 'evt_test', type: 'ignored', data: { object: {} } }, true)))
        .status,
    ).toBe(400)
    expect(mocks.payload.create).not.toHaveBeenCalled()
  })
  it('acknowledges signed unsupported events without writes', async () => {
    expect(
      (await webhook(signed({ id: 'evt_test', type: 'unsupported', data: { object: {} } }))).status,
    ).toBe(200)
    expect(mocks.payload.create).not.toHaveBeenCalled()
  })
  it('returns 500 on failed writes so Stripe retries', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.stripe.checkout.sessions.retrieve.mockResolvedValue({
      id: 'cs_test_abc',
      metadata: { source: 'chancecms' },
      payment_status: 'paid',
    })
    mocks.payload.find.mockRejectedValue(new Error('Database unavailable'))
    const response = await webhook(
      signed({
        id: 'evt_test',
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_test_abc' } },
      }),
    )
    expect(response.status).toBe(500)
  })
  it('updates rather than duplicates a repeated Checkout event', async () => {
    mocks.stripe.checkout.sessions.retrieve.mockResolvedValue({
      id: 'cs_test_abc',
      metadata: { source: 'chancecms' },
      payment_status: 'paid',
      amount_total: 25000,
      currency: 'usd',
    })
    mocks.payload.find
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: 2 }] })
    await syncCheckout(payload, stripe, 'cs_test_abc')
    await syncCheckout(payload, stripe, 'cs_test_abc')
    expect(mocks.payload.create).toHaveBeenCalledTimes(1)
    expect(mocks.payload.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, data: expect.objectContaining({ status: 'paid' }) }),
    )
  })
  it('does not mark asynchronous unpaid checkout as paid', async () => {
    mocks.stripe.checkout.sessions.retrieve.mockResolvedValue({
      id: 'cs_test_abc',
      metadata: { source: 'chancecms' },
      payment_status: 'unpaid',
      status: 'complete',
    })
    mocks.payload.find.mockResolvedValue({ docs: [] })
    await syncCheckout(payload, stripe, 'cs_test_abc')
    expect(mocks.payload.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'pending' }) }),
    )
  })
  it('reads current subscription state instead of an old event snapshot', async () => {
    mocks.stripe.subscriptions.retrieve.mockResolvedValue({
      id: 'sub_1',
      customer: 'cus_1',
      metadata: { source: 'chancecms' },
      status: 'canceled',
      items: { data: [] },
      cancel_at_period_end: false,
    })
    mocks.payload.find.mockResolvedValue({ docs: [{ id: 3 }] })
    await handleStripeEvent(payload, stripe, {
      type: 'customer.subscription.updated',
      data: { object: { id: 'sub_1', status: 'active' } },
    } as Stripe.Event)
    expect(mocks.payload.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'canceled' }) }),
    )
  })
  it('preserves refund state when a checkout webhook is replayed', async () => {
    mocks.stripe.checkout.sessions.retrieve.mockResolvedValue({
      id: 'cs_test_abc',
      metadata: { source: 'chancecms' },
      payment_status: 'paid',
      payment_intent: 'pi_1',
    })
    mocks.stripe.paymentIntents.retrieve.mockResolvedValue({
      latest_charge: { refunded: true, amount_refunded: 25000 },
    })
    mocks.payload.find.mockResolvedValue({ docs: [{ id: 2 }] })
    await syncCheckout(payload, stripe, 'cs_test_abc')
    expect(mocks.payload.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'refunded' }) }),
    )
  })
})

describe('admin invoice generation', () => {
  const req = (user: object | null = { id: 1, collection: 'users' }) =>
    ({
      user,
      headers: new Headers({ origin: 'http://localhost:3000' }),
      routeParams: { id: '1' },
      payload: mocks.payload,
    }) as unknown as PayloadRequest
  it('rejects anonymous callers', async () => {
    await expect(createInvoiceEndpoint.handler(req(null))).rejects.toMatchObject({ status: 401 })
    expect(mocks.stripe.invoices.create).not.toHaveBeenCalled()
  })
  it('reuses an existing invoice without adding another line or creating a customer', async () => {
    const invoice = {
      id: 1,
      operationKey: 'op_1',
      stripeInvoiceID: 'in_1',
      stripeCustomerID: 'cus_1',
      amount: 25000,
    }
    mocks.payload.findByID.mockResolvedValue(invoice)
    mocks.payload.update.mockImplementation(async ({ data }) => ({ ...invoice, ...data }))
    mocks.stripe.invoices.retrieve.mockResolvedValue({
      id: 'in_1',
      status: 'open',
      hosted_invoice_url: 'https://invoice.stripe.com/i/test',
    })
    const response = await createInvoiceEndpoint.handler(req())
    expect(response.status).toBe(200)
    expect(mocks.payload.findByID).toHaveBeenCalledWith(
      expect.objectContaining({ user: expect.any(Object), overrideAccess: false }),
    )
    expect(mocks.stripe.invoices.create).not.toHaveBeenCalled()
    expect(mocks.stripe.invoiceItems.create).not.toHaveBeenCalled()
    expect(mocks.stripe.customers.create).not.toHaveBeenCalled()
  })
  it('recovers a partially created draft without duplicating its line', async () => {
    const invoice = {
      id: 1,
      operationKey: 'op_1',
      stripeInvoiceID: 'in_1',
      stripeCustomerID: 'cus_1',
      amount: 25000,
    }
    mocks.payload.findByID.mockResolvedValue(invoice)
    mocks.payload.update.mockImplementation(async ({ data }) => ({ ...invoice, ...data }))
    mocks.stripe.invoices.retrieve.mockResolvedValue({ id: 'in_1', status: 'draft' })
    mocks.stripe.invoices.listLineItems.mockResolvedValue({ data: [{ amount: 25000 }] })
    mocks.stripe.invoices.finalizeInvoice.mockResolvedValue({
      id: 'in_1',
      status: 'open',
      hosted_invoice_url: 'https://invoice.stripe.com/i/test',
    })
    expect((await createInvoiceEndpoint.handler(req())).status).toBe(200)
    expect(mocks.stripe.invoiceItems.create).not.toHaveBeenCalled()
    expect(mocks.stripe.invoices.finalizeInvoice).toHaveBeenCalledWith(
      'in_1',
      { auto_advance: false },
      { idempotencyKey: 'invoice-finalize-op_1' },
    )
  })
})

describe('billing presentation', () => {
  it('formats zero-decimal and two-decimal currencies correctly', () => {
    expect(formatPrice(25000, 'usd')).toBe('$250.00')
    expect(formatPrice(25000, 'jpy')).toBe('¥25,000')
    expect(formatPrice(500, 'isk')).toBe('ISK 5')
    expect(formatPrice(500, 'ugx')).toBe('UGX 5')
  })
  it('only accepts Stripe-hosted email-login portal URLs', () => {
    vi.stubEnv('STRIPE_CUSTOMER_PORTAL_URL', 'https://attacker.example/p/login/test')
    expect(portalURL()).toBeNull()
    vi.stubEnv('STRIPE_CUSTOMER_PORTAL_URL', 'https://billing.stripe.com/p/login/test_123')
    expect(portalURL()).toBe('https://billing.stripe.com/p/login/test_123')
  })
})

describe('private invoice pages', () => {
  const local = {
    id: 7,
    operationKey: 'private-operation',
    stripeInvoiceID: 'in_private',
    title: 'Domain purchase',
    customerName: 'Example client',
    customerEmail: 'private@example.com',
    kind: 'invoice',
    status: 'open',
  }
  const reference = () => invoicePayPath(local).slice('/pay/'.length)
  beforeEach(() => {
    mocks.payload.find.mockResolvedValue({ docs: [local] })
    mocks.stripe.invoices.retrieve.mockResolvedValue({
      id: 'in_private',
      status: 'open',
      total: 2000,
      amount_remaining: 2000,
      currency: 'usd',
      hosted_invoice_url: 'https://invoice.stripe.com/i/test',
    })
  })
  it('rejects guessed IDs and forged signatures before reading Stripe', async () => {
    expect(await readPublicInvoice(payload, stripe, '7')).toBeNull()
    expect(await readPublicInvoice(payload, stripe, `7.${'0'.repeat(64)}`)).toBeNull()
    expect(mocks.stripe.invoices.retrieve).not.toHaveBeenCalled()
  })
  it('returns only client-facing details for a valid private link', async () => {
    const result = await readPublicInvoice(payload, stripe, reference())
    expect(result?.paymentURL).toBe('https://invoice.stripe.com/i/test')
    expect(result?.total).toBe(2000)
    expect(result).not.toHaveProperty('operationKey')
    expect(result).not.toHaveProperty('customerEmail')
    expect(result).not.toHaveProperty('stripeCustomerID')
  })
  it('keeps the link stable without exposing its underlying operation key', () => {
    expect(reference()).toBe(reference())
    expect(reference()).not.toContain(local.operationKey)
  })
  it('uses current Stripe state and removes payment for paid or void invoices', async () => {
    for (const status of ['paid', 'void', 'uncollectible']) {
      mocks.stripe.invoices.retrieve.mockResolvedValue({
        status,
        amount_remaining: 0,
        hosted_invoice_url: 'https://invoice.stripe.com/i/test',
      })
      const result = await readPublicInvoice(payload, stripe, reference())
      expect(result?.status).toBe(status)
      expect(result?.paymentURL).toBeNull()
    }
  })
  it('does not expose an unfinalized invoice', async () => {
    mocks.stripe.invoices.retrieve.mockResolvedValue({ status: 'draft' })
    expect(await readPublicInvoice(payload, stripe, reference())).toBeNull()
  })
  it('fails closed when Stripe cannot confirm payment state', async () => {
    mocks.stripe.invoices.retrieve.mockRejectedValue(new Error('Stripe unavailable'))
    await expect(readPublicInvoice(payload, stripe, reference())).rejects.toThrow(
      'Stripe unavailable',
    )
  })
})
