import type { CollectionConfig } from 'payload'

import path from 'path'

import { authenticated } from '../access/authenticated'

// Signature images for in-kind contribution records. Stored outside public/ so the
// files are only served through Payload's access-checked file route, never by URL alone.
export const signaturesDir = path.join(process.cwd(), 'private/signatures')

export const Signatures: CollectionConfig = {
  slug: 'signatures',
  labels: { singular: 'Signature', plural: 'Signatures' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Billing',
    description:
      'Signature images for in-kind contribution records. Use a PNG with a transparent background. Only logged-in admins can view these.',
  },
  fields: [{ name: 'name', type: 'text', required: true, label: 'Whose signature' }],
  upload: {
    staticDir: signaturesDir,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
}
