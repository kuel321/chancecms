import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NavLinks } from '@/components/NavLinks'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Footer } from '@/components/Footer'
import './globals.css'

async function getPublishedPages() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload
    .find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      select: { title: true, slug: true },
      sort: 'title',
      limit: 20,
    })
    .catch(() => ({ docs: [] }))
  return result.docs
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const pages = await getPublishedPages()

  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="grain-overlay" />
        <ScrollProgress />
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(240,224,199,0.96)',
            backdropFilter: 'blur(14px)',
            borderBottom: '1px solid var(--color-rule)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 52px',
          }}
        >
          <Link href="/">
            <div className="logo-and-title">
              <img
                src="/media/chance-logo-no-letters-png.png"
                alt="ChanceCMS"
                style={{ height: 46 }}
              />
              <div className="logo-title">Chasing a Chance </div>
            </div>
          </Link>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <NavLinks pages={pages.map((p) => ({ title: p.title, slug: p.slug }))} />
          </nav>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        <Footer />
      </body>
    </html>
  )
}
