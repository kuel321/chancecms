export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post, Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'News & Updates | Chasing a Chance',
  description: 'Web design tips, business insights, and updates from Chasing a Chance — Hurricane, WV.',
  alternates: { canonical: 'https://chasingachance.com/posts' },
  openGraph: {
    title: 'News & Updates | Chasing a Chance',
    description: 'Web design tips, business insights, and updates from Chasing a Chance.',
    url: 'https://chasingachance.com/posts',
    siteName: 'Chasing a Chance',
    images: [{ url: '/meta-image.jpg' }],
    type: 'website',
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

function PostCard({ post }: { post: Post }) {
  const imageUrl =
    post.heroImage && typeof post.heroImage === 'object'
      ? (post.heroImage as Media).url
      : null
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <a
      href={`/posts/${post.slug}`}
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          background: 'var(--color-parchment)',
          border: '1px solid var(--color-rule)',
          overflow: 'hidden',
          marginBottom: 20,
          aspectRatio: '16/9',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--color-parchment)' }} />
        )}
      </div>
      {date && (
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-ember)',
            marginBottom: 8,
          }}
        >
          {date}
        </p>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 20,
          fontWeight: 400,
          color: 'var(--color-midnight)',
          lineHeight: 1.3,
          marginBottom: 10,
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-pine)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-midnight)')}
      >
        {post.title}
      </h2>
      {post.meta?.description && (
        <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', lineHeight: 1.7 }}>
          {post.meta.description}
        </p>
      )}
    </a>
  )
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
            No posts yet — check back soon.
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
