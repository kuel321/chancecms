import type { CollectionConfig } from 'payload'

import path from 'path'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const ClientFiles: CollectionConfig = {
  slug: 'client-files',
  folders: true,
  labels: {
    singular: 'Client File',
    plural: 'Client Files',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Optional description of the file, shown to the client.',
      },
    },
  ],
  upload: {
    staticDir: path.join(process.cwd(), 'public/client-files'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
      },
    ],
  },
}
