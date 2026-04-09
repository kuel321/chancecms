import type { Block } from 'payload'

export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { plural: 'Newsletter Blocks', singular: 'Newsletter' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Sign Up',
      label: 'Button Label',
    },
  ],
}
