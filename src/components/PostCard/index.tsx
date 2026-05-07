'use client'
import type { Post, Media } from '@/payload-types'

export function PostCard({ post }: { post: Post }) {
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
