import { notFound } from 'next/navigation'
import { getCachedDocument } from '@/utilities/getDocument'
import { Blocks } from '@/components/Blocks'
import { Hero } from '@/heros/Component'
import type { Page } from '@/payload-types'

type Props = {
  params: Promise<{ slug: string }>
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
