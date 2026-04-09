'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Post, Media } from '@/payload-types'

function PostCard({ post, index }: { post: Post; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const imageUrl = post.heroImage && typeof post.heroImage === 'object'
    ? (post.heroImage as Media).url
    : null

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <motion.a
      ref={ref}
      href={`/posts/${post.slug}`}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        background: 'var(--color-parchment)',
        border: '1px solid var(--color-rule)',
        overflow: 'hidden',
        marginBottom: 20,
        aspectRatio: '16/9',
      }}>
        {imageUrl
          ? <img src={imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          : <div style={{ width: '100%', height: '100%', background: 'var(--color-parchment)' }} />
        }
      </div>
      {date && (
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-ember)', marginBottom: 8 }}>
          {date}
        </p>
      )}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: 20,
        fontWeight: 400, color: 'var(--color-midnight)',
        lineHeight: 1.3, marginBottom: 10,
        transition: 'color 0.2s',
      }}
        onMouseOver={e => (e.currentTarget.style.color = 'var(--color-pine)')}
        onMouseOut={e => (e.currentTarget.style.color = 'var(--color-midnight)')}
      >
        {post.title}
      </h3>
      {post.meta?.description && (
        <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', lineHeight: 1.7 }}>
          {post.meta.description}
        </p>
      )}
    </motion.a>
  )
}

export function HomeLatestNews({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section style={{ background: 'var(--color-cream)', padding: '88px 52px', borderBottom: '1px solid var(--color-rule)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 52 }}>
          <div>
            <p className="sec-label">Latest</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 400, color: 'var(--color-midnight)' }}>News &amp; Updates</h2>
          </div>
          <a href="/posts" style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-pine)',
            textDecoration: 'none',
          }}>
            All Posts →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 40 }}>
          {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
        </div>
      </div>
    </section>
  )
}
