import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCachedDocument } from '@/utilities/getDocument'
import { Blocks } from '@/components/Blocks'
import { Hero } from '@/heros/Component'
import type { Page, Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pageData = await getCachedDocument('pages', slug)()
  if (!pageData) return {}

  const page = pageData as Page
  const meta = page.meta
  const ogImage = meta?.image && typeof meta.image === 'object'
    ? (meta.image as Media).url ?? undefined
    : undefined

  const title = meta?.title ?? page.title
  const description = meta?.description ?? undefined
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
    : [{ url: '/meta-image.jpg', width: 1200, height: 630, alt: title }]

  return {
    title,
    description,
    alternates: {
      canonical: `https://chasingachance.com/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${getServerSideURL()}/${slug}`,
      siteName: 'Chasing a Chance',
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : ['/meta-image.jpg'],
    },
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const pageData = await getCachedDocument('pages', slug)()

  if (!pageData) notFound()

  const page = pageData as Page

  return (
    <>
      <Hero hero={page.hero} />
      <Blocks blocks={page.layout} />
    </>
  )
}
