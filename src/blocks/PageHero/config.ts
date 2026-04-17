import type { Block } from 'payload'

export const PageHero: Block = {
  slug: 'pageHero',
  labels: {
    singular: 'Page Hero',
    plural: 'Page Heroes',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Label (small text above heading)',
      admin: {
        placeholder: 'e.g. Hurricane, WV — Est. 2023',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: {
        placeholder: 'e.g. Built around a very good boy.',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading (italic, optional)',
      admin: {
        placeholder: 'e.g. Chasing a Chance is a web design and software company...',
      },
    },
  ],
}
