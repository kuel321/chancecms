import { notFound } from 'next/navigation'
import { getCachedDocument } from '@/utilities/getDocument'
import { Blocks } from '@/components/Blocks'
import { Hero } from '@/heros/Component'
import type { Page } from '@/payload-types'

export default async function HomePage() {
  const pageData = await getCachedDocument('pages', 'home')()

  if (!pageData) notFound()

  const page = pageData as Page

  return (
    <>
      <Hero hero={page.hero} />
      <Blocks blocks={page.layout} />
    </>
  )
}
