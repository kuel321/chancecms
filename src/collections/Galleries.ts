import type { CollectionConfig, FieldHook, TextFieldSingleValidation } from 'payload'

import { authenticated } from '../access/authenticated'
import { hashPassword } from '../utilities/password'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

const generateSlugFromTitle: FieldHook = ({ value, data }) => {
  if (value) return value
  return data?.title ? slugify(String(data.title)) : value
}

const validatePassword: TextFieldSingleValidation = (value, { operation }) => {
  if (operation === 'create' && !value) {
    return 'A password is required.'
  }
  return true
}

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: 'Client Gallery',
    plural: 'Client Galleries',
  },
  // Kept admin-only: the frontend gallery page and API routes look these up
  // through the Payload Local API, which bypasses access control by default.
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    description: 'Password-protected galleries clients can use to view and download their files.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name, e.g. the client or project name.',
      },
    },
    {
      name: 'note',
      type: 'textarea',
      admin: {
        description: 'Optional note shown to the client on the gallery page.',
      },
    },
    {
      name: 'files',
      type: 'relationship',
      relationTo: 'client-files',
      hasMany: true,
      required: true,
    },
    {
      name: 'password',
      type: 'text',
      virtual: true,
      admin: {
        description:
          'Password the client will enter to view this gallery. Leave blank when editing to keep the current password.',
      },
      validate: validatePassword,
    },
    {
      name: 'passwordHash',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Used in the gallery link, e.g. /gallery/your-slug. Auto-filled from the title, or edit it if you want something different.',
      },
      hooks: {
        beforeValidate: [generateSlugFromTitle],
      },
    },
  ],
  hooks: {
    // Runs before the field-level `validate` on `password` (which still needs to see
    // the submitted value), so it only computes the hash here and leaves `password`
    // alone; the field's `virtual: true` already keeps it out of the database.
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data?.password) {
          data.passwordHash = hashPassword(String(data.password))
        } else if (originalDoc?.passwordHash) {
          data.passwordHash = originalDoc.passwordHash
        }
        return data
      },
    ],
  },
}
