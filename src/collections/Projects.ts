import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'description', 'order'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Site Screenshot',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Live Site URL',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Lower numbers appear first.',
        position: 'sidebar',
      },
    },
  ],
}
