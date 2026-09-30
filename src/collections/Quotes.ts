import type { CollectionConfig, Condition, NumberField } from 'payload'
import { authenticated } from '@/access/authenticated'
import {
  calculateQuote,
  inKindProjectOptions,
  quoteTiers,
  quoteValidDays,
  type QuoteKind,
  type QuotePackage,
} from '@/utilities/quotePricing'

const dollars = (name: string, label: string, description?: string): NumberField => ({
  name,
  type: 'number',
  label,
  min: 0,
  max: 999999,
  admin: { description, step: 1 },
})

const isInKind: Condition = (data) => data?.kind === 'inKind'
const isBusiness: Condition = (data) => data?.kind !== 'inKind'
const showsEstimate = (data: Partial<{ kind: QuoteKind; showEstimatedValue: boolean }>) =>
  data?.kind === 'inKind' && Boolean(data.showEstimatedValue)
const isWebsite: Condition = (data) =>
  data?.kind !== 'inKind' || !data?.projectType || data.projectType === 'website'

const volunteerStatement =
  'All services listed as volunteer were performed personally by the contributor, on personal time and without compensation. Uncompensated volunteer personal services are not a contribution under W. Va. Code §3-8-1a, so they carry no value. No corporation or business, including any business owned by the contributor, provided, paid for, or supplied equipment or software for this work. Any item listed with a dollar amount is an in-kind contribution from the contributor, valued at fair market value.'

const requiredForInKind = (value: unknown, { data }: { data: Partial<{ kind: QuoteKind }> }) =>
  data?.kind !== 'inKind' || Boolean(value) || 'Required for in-kind donations.'

const packagePrice = dollars(
  'packagePrice',
  'Package price ($)',
  'Leave blank for the package starting price (Launch $2,000–2,500, Grow $4,000–5,000).',
)

const price = dollars(
  'price',
  'Price ($)',
  'On in-kind records: what you paid for a purchased item, or the estimated value of volunteer work.',
)

const estimatedValue = dollars('estimatedValue', 'Estimated value ($)', 'Reference only.')

const carePlanPrice = dollars(
  'carePlanPrice',
  'Monthly price ($)',
  'Leave blank for the package rate (Launch $150, Grow $200).',
)

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  labels: { singular: 'Quote', plural: 'Quotes' },
  // Admin-only: the printable quote page checks the Payload session before rendering.
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Billing',
    useAsTitle: 'title',
    defaultColumns: ['quoteNumber', 'title', 'clientName', 'package', 'total', 'status'],
    description:
      'Build a quote from the Launch or Grow package, then open it to download a PDF. Switch the type to "Personal in-kind donation" for work donated personally (no Chasing a Chance branding). Amounts are in whole US dollars.',
  },
  fields: [
    {
      name: 'quoteActions',
      type: 'ui',
      admin: { components: { Field: '@/components/QuoteActions' } },
    },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Project name' },
        {
          name: 'quoteNumber',
          type: 'text',
          unique: true,
          index: true,
          admin: { readOnly: true, description: 'Assigned on first save.' },
        },
      ],
    },
    {
      name: 'kind',
      type: 'select',
      label: 'Type',
      defaultValue: 'business',
      required: true,
      options: [
        { label: 'Chasing a Chance quote', value: 'business' },
        { label: 'Personal in-kind donation', value: 'inKind' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'In-kind donations are issued under your own name with no company branding, hosting, or payment terms. Your labor is listed as volunteer (no charge); only purchased items carry a value.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: ['draft', 'sent', 'accepted', 'declined'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'issueDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'For in-kind donations, the date the contribution was made.',
      },
    },
    {
      name: 'election',
      type: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'General', value: 'general' },
      ],
      validate: requiredForInKind,
      admin: {
        position: 'sidebar',
        condition: isInKind,
        description: 'Campaigns report contributions against the primary or general election.',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      required: true,
      defaultValue: () => new Date(Date.now() + quoteValidDays * 86400000).toISOString(),
      admin: {
        position: 'sidebar',
        condition: isBusiness,
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'total',
      type: 'number',
      label: 'One-time total ($)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'Calculated on save. For in-kind donations this is the reportable value (purchased items only).',
      },
    },
    {
      type: 'collapsible',
      label: 'Contributor',
      admin: {
        condition: isInKind,
        description:
          'The person making the donation. Campaigns report name, mailing address, and date for every in-kind contribution, plus occupation and employer once your total to them is over $250.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'donorName',
              type: 'text',
              label: 'Full name',
              validate: requiredForInKind,
            },
            { name: 'donorEmail', type: 'email', label: 'Email' },
          ],
        },
        { name: 'donorAddress', type: 'textarea', label: 'Mailing address' },
        {
          type: 'row',
          fields: [
            { name: 'donorOccupation', type: 'text', label: 'Occupation' },
            { name: 'donorEmployer', type: 'text', label: 'Employer' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Client / recipient',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'clientName', type: 'text', required: true, label: 'Contact name' },
            { name: 'clientCompany', type: 'text', label: 'Business or campaign' },
            { name: 'clientEmail', type: 'email', label: 'Email' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Work donated',
      admin: { condition: isInKind },
      fields: [
        {
          name: 'projectType',
          type: 'select',
          label: 'Type of work',
          defaultValue: 'website',
          options: inKindProjectOptions,
        },
        {
          name: 'workDescription',
          type: 'textarea',
          label: 'What you did',
          admin: {
            condition: (data) => data?.projectType && data.projectType !== 'website',
            placeholder: 'e.g. 6×9 postcard, front and back, print-ready files',
            description: 'Shown under the main line item.',
          },
        },
        {
          name: 'showEstimatedValue',
          type: 'checkbox',
          label: 'Show estimated value of volunteer work',
          defaultValue: false,
          admin: {
            description:
              'For reference only. Estimates print beside "Volunteer, no charge" and in a separate total, never in the reportable value. Websites use the package price field; add-ons use their price.',
          },
        },
        {
          ...estimatedValue,
          admin: {
            ...estimatedValue.admin,
            condition: (data) =>
              showsEstimate(data) && Boolean(data?.projectType) && data.projectType !== 'website',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Package',
      admin: { condition: isWebsite },
      fields: [
        {
          name: 'package',
          type: 'select',
          required: true,
          defaultValue: 'launch',
          options: [
            { label: 'Launch', value: 'launch' },
            { label: 'Grow', value: 'grow' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              ...packagePrice,
              admin: {
                ...packagePrice.admin,
                condition: (data) => data?.kind !== 'inKind' || showsEstimate(data),
              },
            },
            {
              name: 'pages',
              type: 'number',
              min: 1,
              max: 200,
              admin: {
                step: 1,
                description: `Launch includes ${quoteTiers.launch.includedPages}, Grow includes ${quoteTiers.grow.includedPages}. Extra pages are added as a line item.`,
              },
            },
          ],
        },
        {
          name: 'photography',
          type: 'checkbox',
          label: 'Add photography',
          admin: {
            condition: (data) => data?.package !== 'grow',
            description: 'Photography is included with Grow and an add-on for Launch.',
          },
        },
      ],
    },
    {
      name: 'addOns',
      type: 'array',
      label: 'Add-ons',
      labels: { singular: 'Add-on', plural: 'Add-ons' },
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true },
            {
              name: 'inKindType',
              type: 'select',
              label: 'In-kind type',
              defaultValue: 'volunteer',
              options: [
                { label: 'Volunteer work (no charge)', value: 'volunteer' },
                { label: 'Purchased item (at value)', value: 'item' },
              ],
              admin: {
                condition: isInKind,
                description: 'Items you paid for, e.g. stock photos, fonts, domains.',
              },
            },
            {
              ...price,
              required: true,
              admin: {
                ...price.admin,
                condition: (data, siblingData) =>
                  data?.kind !== 'inKind' ||
                  siblingData?.inKindType === 'item' ||
                  showsEstimate(data),
              },
            },
          ],
        },
        { name: 'description', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Discount & hosting',
      admin: { condition: isBusiness },
      fields: [
        {
          type: 'row',
          fields: [
            dollars('discount', 'Discount ($)'),
            { name: 'discountLabel', type: 'text', admin: { placeholder: 'Discount' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'includeCarePlan',
              type: 'checkbox',
              label: 'Include Hosting & Support',
              defaultValue: true,
            },
            {
              ...carePlanPrice,
              admin: {
                ...carePlanPrice.admin,
                condition: (_, siblingData) => Boolean(siblingData?.includeCarePlan),
              },
            },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Shown on the quote, e.g. project scope or timeline.' },
    },
    {
      name: 'terms',
      type: 'textarea',
      defaultValue:
        'A 50% deposit is due to begin work, with the balance due at launch. Hosting & Support is billed monthly starting at launch and can be cancelled anytime.',
      admin: { condition: isBusiness },
    },
    {
      name: 'donationStatement',
      type: 'textarea',
      label: 'Contribution statement',
      defaultValue: volunteerStatement,
      admin: {
        condition: isInKind,
        description:
          'Printed on the donation document in place of payment terms. Edit it if anything here is not true.',
      },
    },
    {
      name: 'showReceivedBy',
      type: 'checkbox',
      label: 'Include "Received for the campaign by" signature line',
      defaultValue: true,
      admin: { condition: isInKind },
    },
    {
      name: 'signature',
      type: 'upload',
      relationTo: 'signatures',
      label: 'Contributor signature',
      // New records pick up the signature saved on the creating user's profile.
      defaultValue: ({ user }) => {
        const signature = (user as { signature?: number | { id: number } | null } | null)?.signature
        return typeof signature === 'object' ? signature?.id : signature
      },
      admin: {
        condition: isInKind,
        description:
          'Printed on the contributor line with the date the PDF is generated. Clear it to leave the line blank.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.total = calculateQuote({
          ...data,
          kind: data.kind as QuoteKind,
          package: data.package as QuotePackage,
        }).total
        return data
      },
    ],
    afterChange: [
      // Numbered from the row id, which the database assigns atomically, so two quotes
      // saved at once can't be given the same number.
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || doc.quoteNumber) return doc
        const prefix = doc.kind === 'inKind' ? 'IK' : 'Q'
        const quoteNumber = `${prefix}-${new Date().getFullYear()}-${String(doc.id).padStart(3, '0')}`
        await req.payload.update({
          collection: 'quotes',
          id: doc.id,
          data: { quoteNumber },
          depth: 0,
          req,
        })
        return { ...doc, quoteNumber }
      },
    ],
  },
  timestamps: true,
}
