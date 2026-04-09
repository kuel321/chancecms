import type { Block } from 'payload'

export const MeetTheCandidate: Block = {
  slug: 'meetTheCandidate',
  interfaceName: 'MeetTheCandidateBlock',
  labels: { plural: 'Meet the Candidate Blocks', singular: 'Meet the Candidate' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Bio',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Candidate Photo',
    },
  ],
}
