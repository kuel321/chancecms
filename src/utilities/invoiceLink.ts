import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Payload } from 'payload'
import type Stripe from 'stripe'
import type { BillingInvoice } from '@/payload-types'

export function invoicePayPath(invoice: Pick<BillingInvoice, 'id' | 'operationKey'>): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret || !invoice.operationKey) throw new Error('Invoice link is not configured')
  const signature = createHmac('sha256', secret)
    .update(`invoice-link:${invoice.id}:${invoice.operationKey}`)
    .digest('hex')
  return `/pay/${invoice.id}.${signature}`
}

export async function readPublicInvoice(payload: Payload, stripe: Stripe, reference: string) {
  const match = /^([1-9]\d*)\.([a-f0-9]{64})$/.exec(reference)
  if (!match || !Number.isSafeInteger(Number(match[1]))) return null
  // Intentional internal read: the unguessable capability below replaces CMS login for this one invoice.
  const result = await payload.find({
    collection: 'billing-invoices',
    overrideAccess: true,
    where: { id: { equals: Number(match[1]) } },
    depth: 0,
    limit: 1,
  })
  const invoice = result.docs[0]
  if (!invoice?.operationKey || !invoice.stripeInvoiceID) return null
  const expected = invoicePayPath(invoice).slice('/pay/'.length)
  if (!timingSafeEqual(Buffer.from(reference), Buffer.from(expected))) return null
  const remote = await stripe.invoices.retrieve(invoice.stripeInvoiceID)
  if (!remote.status || remote.status === 'draft') return null
  // Only return the details needed on the client page, never the CMS record or its secrets.
  return {
    title: invoice.title,
    kind: invoice.kind,
    customerName: invoice.customerName,
    number: remote.number,
    status: remote.status,
    currency: remote.currency,
    total: remote.total,
    remaining: remote.amount_remaining,
    dueDate: remote.due_date,
    paidAt: remote.status_transitions?.paid_at,
    paymentURL:
      remote.status === 'open' && remote.amount_remaining > 0 ? remote.hosted_invoice_url : null,
  }
}
