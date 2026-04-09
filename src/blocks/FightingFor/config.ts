import type { Block } from 'payload'

export const FightingFor: Block = {
  slug: 'fightingFor',
  interfaceName: 'FightingForBlock',
  labels: { plural: 'Fighting For Blocks', singular: 'Fighting For' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'issues',
      type: 'array',
      label: 'Issues',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
        },
      ],
    },
  ],
}
