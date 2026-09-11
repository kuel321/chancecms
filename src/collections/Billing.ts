import { randomUUID } from 'crypto'
import { APIError, type CollectionConfig, type TextField } from 'payload'
import { authenticated } from '@/access/authenticated'
import { getStripe, validatePrice } from '@/utilities/stripe'
import { createInvoiceEndpoint } from '@/endpoints/createInvoice'

const adminAccess = {
  create: authenticated,
  read: authenticated,
  update: authenticated,
  delete: authenticated,
}
const managedText = (name: string, unique = false): TextField => ({
  name,
  type: 'text',
  unique,
  index: unique,
  admin: { readOnly: true },
  access: { create: () => false, update: () => false },
})

export const BillingOffers: CollectionConfig = {
  slug: 'billing-offers',
  labels: { singular: 'Service / Plan', plural: 'Services & Plans' },
  admin: {
    group: 'Billing',
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'stripePriceID'],
    description:
      'Create products and fixed prices in Stripe, then paste a price ID here. Recurring prices become subscriptions.',
  },
  access: { ...adminAccess, read: ({ req }) => (req.user ? true : { active: { equals: true } }) },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description:
          'Link name, e.g. domain-purchase. Filled from the title on first save; keep it unchanged after sharing.',
      },
      validate: (value: unknown) =>
        !value || (typeof value === 'string' && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value))
          ? true
          : 'Use lowercase letters, numbers, and single hyphens; start with a letter.',
    },
    {
      name: 'clientLink',
      type: 'ui',
      admin: { components: { Field: '@/components/ServiceLink' } },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'stripePriceID',
      type: 'text',
      required: true,
      label: 'Stripe price ID',
      validate: (value: unknown) =>
        typeof value === 'string' && /^price_[a-zA-Z0-9]+$/.test(value)
          ? true
          : 'Enter a Stripe price_ ID.',
    },
    { name: 'active', type: 'checkbox', defaultValue: false, label: 'Available on the website' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (data && !data.slug) {
          const titleSlug = String(data.title ?? originalDoc?.title ?? '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
          data.slug =
            originalDoc?.slug ||
            (/^[a-z]/.test(titleSlug) ? titleSlug : `service-${titleSlug || randomUUID()}`)
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, originalDoc }) => {
        if (data.active ?? originalDoc?.active) {
          try {
            validatePrice(
              await getStripe().prices.retrieve(data.stripePriceID ?? originalDoc.stripePriceID, {
                expand: ['product'],
              }),
            )
          } catch {
            throw new APIError(
              'Could not activate this offer. Check the Stripe key, product, and fixed price ID.',
              400,
            )
          }
        }
        return data
      },
    ],
  },
}

export const BillingInvoices: CollectionConfig = {
  slug: 'billing-invoices',
  labels: { singular: 'Invoice / Deposit', plural: 'Invoices & Deposits' },
  admin: {
    group: 'Billing',
    useAsTitle: 'title',
    defaultColumns: ['title', 'customerEmail', 'amount', 'status'],
    description:
      'Save a draft, then generate a Stripe invoice. Share its payment link with your client. Amounts are in cents (USD).',
  },
  access: { ...adminAccess, delete: () => false },
  endpoints: [createInvoiceEndpoint],
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'invoice',
      options: ['invoice', 'deposit'],
    },
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerEmail', type: 'email', required: true },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 50,
      max: 99999999,
      label: 'Amount in cents (USD)',
      validate: (v: unknown) =>
        typeof v === 'number' && Number.isSafeInteger(v) && v >= 50 && v <= 99999999
          ? true
          : 'Use whole cents between 50 and 99,999,999.',
    },
    {
      name: 'daysUntilDue',
      type: 'number',
      defaultValue: 30,
      required: true,
      min: 1,
      max: 365,
      validate: (v: unknown) =>
        typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 365
          ? true
          : 'Use 1–365 whole days.',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'open', 'paid', 'void', 'uncollectible'],
      admin: { readOnly: true },
      access: { create: () => false, update: () => false },
    },
    managedText('stripeCustomerID'),
    managedText('stripeInvoiceID', true),
    managedText('hostedInvoiceURL'),
    { ...managedText('operationKey', true), defaultValue: () => randomUUID() },
    {
      name: 'stripeActions',
      type: 'ui',
      admin: { components: { Field: '@/components/InvoiceActions' } },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // Once creation starts, freeze the request so retries use the same Stripe parameters.
        if (originalDoc?.stripeCustomerID) {
          for (const key of [
            'title',
            'kind',
            'customerName',
            'customerEmail',
            'amount',
            'daysUntilDue',
          ]) {
            if (data[key] !== undefined && data[key] !== originalDoc[key]) {
              throw new APIError(
                'This invoice has been sent to Stripe. Create a new draft to change its billing details.',
                400,
              )
            }
          }
        }
        return data
      },
    ],
  },
}

export const BillingPayments: CollectionConfig = {
  slug: 'billing-payments',
  admin: {
    group: 'Billing',
    useAsTitle: 'stripeSessionID',
    defaultColumns: ['customerEmail', 'amount', 'currency', 'status'],
    description:
      'Checkout records synced from Stripe. Manage refunds and disputes in the Stripe Dashboard.',
  },
  access: { read: authenticated, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'stripeSessionID', type: 'text', required: true, unique: true, index: true },
    { name: 'offerTitle', type: 'text' },
    { name: 'customerEmail', type: 'email' },
    { name: 'stripeCustomerID', type: 'text', index: true },
    { name: 'stripePaymentIntentID', type: 'text', index: true },
    { name: 'stripeSubscriptionID', type: 'text', index: true },
    { name: 'amount', type: 'number', label: 'Total in smallest currency unit' },
    { name: 'currency', type: 'text' },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'failed', 'expired', 'refunded', 'partially_refunded'],
    },
    { name: 'livemode', type: 'checkbox' },
  ],
}

export const BillingSubscriptions: CollectionConfig = {
  slug: 'billing-subscriptions',
  admin: {
    group: 'Billing',
    useAsTitle: 'stripeSubscriptionID',
    defaultColumns: ['stripeCustomerID', 'status', 'cancelAtPeriodEnd'],
    description:
      'Current Stripe subscription state. Customers manage their plans through Billing on the website.',
  },
  access: { read: authenticated, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'stripeSubscriptionID', type: 'text', required: true, unique: true, index: true },
    { name: 'stripeCustomerID', type: 'text', required: true, index: true },
    { name: 'status', type: 'text', required: true },
    { name: 'stripePriceID', type: 'text' },
    { name: 'cancelAtPeriodEnd', type: 'checkbox' },
    { name: 'livemode', type: 'checkbox' },
  ],
}
