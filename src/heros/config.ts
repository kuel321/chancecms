import type { Field } from 'payload'
import { link } from '@/fields/link'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'none',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      label: false,
    },
    link({
      overrides: {
        admin: {
          condition: (_, { type }) => type !== 'none',
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type }) => ['highImpact', 'mediumImpact'].includes(type),
      },
      label: 'Media',
      relationTo: 'media',
    },
  ],
  label: 'Hero',
}
