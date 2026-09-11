import { APIError, type Endpoint } from 'payload'
import { billingOrigin, getStripe, invoiceStatus } from '@/utilities/stripe'
import type { BillingInvoice } from '@/payload-types'
import { invoicePayPath } from '@/utilities/invoiceLink'

export const createInvoiceEndpoint: Endpoint = {
  path: '/:id/create-stripe-invoice',
  method: 'post',
  handler: async (req) => {
    if (!req.user) throw new APIError('Unauthorized', 401)
    if (req.headers.get('origin') !== billingOrigin()) throw new APIError('Invalid origin', 403)
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET)
      throw new APIError('Configure the Stripe key and webhook before generating invoices.', 503)
    const id = Number(req.routeParams?.id)
    if (!Number.isSafeInteger(id)) throw new APIError('Invalid invoice', 400)
    // Local API calls acting as the admin explicitly enforce collection access.
    let invoice = await req.payload.findByID({
      collection: 'billing-invoices',
      id,
      req,
      user: req.user,
      overrideAccess: false,
    })
    const stripe = getStripe()
    const key = invoice.operationKey
    if (!key) throw new APIError('Save this invoice before generating its Stripe link.', 400)
    // Stripe-owned fields are written through an intentional internal access bypass.
    const save = async (data: Partial<BillingInvoice>) => {
      invoice = await req.payload.update({
        collection: 'billing-invoices',
        id,
        data,
        req,
        overrideAccess: true,
      })
    }
    try {
      if (!invoice.stripeCustomerID) {
        const customers = await stripe.customers.list({ email: invoice.customerEmail, limit: 1 })
        const customer =
          customers.data[0] ??
          (await stripe.customers.create(
            {
              email: invoice.customerEmail,
              name: invoice.customerName,
              metadata: { source: 'chancecms', invoiceRequestID: String(id) },
            },
            { idempotencyKey: `invoice-customer-${key}` },
          ))
        await save({ stripeCustomerID: customer.id })
      }
      if (!invoice.stripeInvoiceID) {
        const draft = await stripe.invoices.create(
          {
            customer: invoice.stripeCustomerID!,
            collection_method: 'send_invoice',
            auto_advance: false,
            days_until_due: invoice.daysUntilDue,
            currency: 'usd',
            pending_invoice_items_behavior: 'exclude',
            metadata: { source: 'chancecms', invoiceRequestID: String(id), kind: invoice.kind },
          },
          { idempotencyKey: `invoice-${key}` },
        )
        await save({ stripeInvoiceID: draft.id })
      }
      let remote = await stripe.invoices.retrieve(invoice.stripeInvoiceID!)
      if (remote.status === 'draft') {
        // Inspect existing lines as well as using idempotency keys: retries after 24h remain safe.
        const lines = await stripe.invoices.listLineItems(remote.id, { limit: 100 })
        if (lines.data.length === 0) {
          await stripe.invoiceItems.create(
            {
              customer: invoice.stripeCustomerID!,
              invoice: remote.id,
              amount: invoice.amount,
              currency: 'usd',
              description: `${invoice.kind === 'deposit' ? 'Deposit: ' : ''}${invoice.title}`,
            },
            { idempotencyKey: `invoice-line-${key}` },
          )
        } else if (lines.data.length !== 1 || lines.data[0].amount !== invoice.amount) {
          throw new Error('Stripe invoice lines differ from the saved request')
        }
        remote = await stripe.invoices.finalizeInvoice(
          remote.id,
          { auto_advance: false },
          { idempotencyKey: `invoice-finalize-${key}` },
        )
      }
      await save({
        status: invoiceStatus(remote.status),
        hostedInvoiceURL: remote.hosted_invoice_url,
      })
      return Response.json({
        url: `${billingOrigin()}${invoicePayPath(invoice)}`,
        status: remote.status,
      })
    } catch (error) {
      req.payload.logger.error({ err: error, msg: 'Stripe invoice creation failed' })
      throw new APIError(
        'Stripe could not finish this invoice. Retry, or check the server log and Stripe Dashboard.',
        502,
      )
    }
  },
}
