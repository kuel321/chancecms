export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post } from '@/payload-types'
import { PostCard } from '@/components/PostCard'

export const metadata: Metadata = {
  title: 'News & Updates | Chasing a Chance',
  description: 'Web design tips, business insights, and updates from Chasing a Chance, Hurricane, WV.',
  alternates: { canonical: 'https://chasingachance.com/posts' },
  openGraph: {
    title: 'News & Updates | Chasing a Chance',
    description: 'Web design tips, business insights, and updates from Chasing a Chance.',
    url: 'https://chasingachance.com/posts',
    siteName: 'Chasing a Chance',
    images: [{ url: '/meta-image.jpg', width: 1200, height: 630, alt: 'News & Updates, Chasing a Chance' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Updates | Chasing a Chance',
    description: 'Web design tips, business insights, and updates from Chasing a Chance, Hurricane, WV.',
    images: ['/meta-image.jpg'],
  },
}

async function getPosts() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload
    .find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 100,
      depth: 1,
    })
    .catch(() => ({ docs: [] }))
  return result.docs as Post[]
}


export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <section style={{ background: 'var(--color-cream)', minHeight: '60vh' }}>
      <div
        style={{
          background: 'var(--color-linen)',
          borderBottom: '1px solid var(--color-rule)',
          padding: '72px 52px 64px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="sec-label">From the Studio</p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 400,
              color: 'var(--color-midnight)',
              maxWidth: 600,
            }}
          >
            News &amp; Updates
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 52px' }}>
        {posts.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', fontWeight: 300 }}>
            No posts yet, check back soon.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 48,
            }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
