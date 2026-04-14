import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NavLinks } from '@/components/NavLinks'
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

        <footer
          style={{
            background: 'var(--color-midnight)',
            padding: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(240,224,199,0.06)',
          }}
        >
          <img
            src="/media/chance-logo-no-letters-png.png"
            alt="ChanceCMS"
            style={{ height: 60, opacity: 0.7 }}
          />
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(240,224,199,0.4)',
                marginBottom: 8,
              }}
            >
              Powered by ChanceCMS
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 15,
                color: 'rgba(240,224,199,0.2)',
              }}
            >
              Building experiences that matter.
            </p>
            <a
              href="mailto:chasingachancellc@gmail.com"
              style={{ fontSize: 13, color: 'rgba(240,224,199,0.3)' }}
            >
              chasingachancellc@gmail.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
