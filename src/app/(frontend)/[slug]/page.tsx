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

  return {
    title: meta?.title ?? page.title,
    description: meta?.description ?? undefined,
    openGraph: {
      title: meta?.title ?? page.title,
      description: meta?.description ?? undefined,
      url: `${getServerSideURL()}/${slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
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
