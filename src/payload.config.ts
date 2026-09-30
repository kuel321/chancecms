import { sqliteAdapter } from '@payloadcms/db-sqlite'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import {
  BillingOffers,
  BillingInvoices,
  BillingPayments,
  BillingSubscriptions,
} from './collections/Billing'
import { ClientFiles } from './collections/ClientFiles'
import { Galleries } from './collections/Galleries'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Quotes } from './collections/Quotes'
import { Signatures } from './collections/Signatures'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      icons: [{ url: '/media/chance-logo-no-letters-png.png' }],
    },
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterDashboard: ['@/components/BillingSetup'],
      afterNavLinks: ['@/components/AdminFooter'],
      graphics: {
        Logo: '@/components/AdminLogo',
        Icon: '@/components/AdminIcon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: sqliteAdapter({
    push: process.env.PAYLOAD_SCHEMA_PUSH === 'false' ? false : undefined,
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    Pages,
    Posts,
    Projects,
    Media,
    Categories,
    Users,
    ClientFiles,
    Galleries,
    BillingOffers,
    BillingInvoices,
    BillingPayments,
    BillingSubscriptions,
    Quotes,
    Signatures,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
