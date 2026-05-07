import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post, Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import RichText from '@/components/RichText'

type Props = {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return (result.docs[0] as Post) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const meta = post.meta
  const ogImage =
    meta?.image && typeof meta.image === 'object'
      ? (meta.image as Media).url ?? undefined
      : undefined

  const title = meta?.title ?? `${post.title} | Chasing a Chance`
  const description = meta?.description ?? undefined
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }]
    : [{ url: '/meta-image.jpg', width: 1200, height: 630, alt: post.title }]

  return {
    title,
    description,
    alternates: { canonical: `https://chasingachance.com/posts/${slug}` },
    openGraph: {
      title: meta?.title ?? post.title,
      description,
      url: `${getServerSideURL()}/posts/${slug}`,
      siteName: 'Chasing a Chance',
      images,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta?.title ?? post.title,
      description,
      images: ogImage ? [ogImage] : ['/meta-image.jpg'],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const heroUrl =
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

  const authors = post.populatedAuthors ?? []

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(post.meta?.description && { description: post.meta.description }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    dateModified: post.updatedAt,
    image: heroUrl ?? `https://chasingachance.com/meta-image.jpg`,
    url: `https://chasingachance.com/posts/${slug}`,
    author: authors.length > 0
      ? authors.map((a) => ({ '@type': 'Person', name: a.name }))
      : [{ '@type': 'Organization', name: 'Chasing a Chance' }],
    publisher: {
      '@type': 'Organization',
      name: 'Chasing a Chance',
      logo: { '@type': 'ImageObject', url: 'https://chasingachance.com/media/chance-logo-no-letters-png.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://chasingachance.com/posts/${slug}` },
  }

  return (
    <article style={{ background: 'var(--color-cream)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {heroUrl && (
        <div
          style={{
            width: '100%',
            maxHeight: 520,
            overflow: 'hidden',
            borderBottom: '1px solid var(--color-rule)',
          }}
        >
          <img
            src={heroUrl}
            alt={post.title}
            style={{ width: '100%', maxHeight: 520, objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '64px 32px 0' }}>
        <a
          href="/posts"
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-ember)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: 32,
          }}
        >
          ← All Posts
        </a>

        {(date || authors.length > 0) && (
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: 16,
            }}
          >
            {date}
            {authors.length > 0 && ` · ${authors.map((a) => a.name).join(', ')}`}
          </p>
        )}

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 400,
            color: 'var(--color-midnight)',
            lineHeight: 1.2,
            marginBottom: 48,
          }}
        >
          {post.title}
        </h1>
      </div>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 32px 96px' }}>
        <RichText data={post.content} enableGutter={false} enableProse={false} />
      </div>
    </article>
  )
}
