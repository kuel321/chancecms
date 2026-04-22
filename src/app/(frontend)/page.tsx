export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chasing a Chance | Web Design & Custom Software — Hurricane, WV',
  description: 'West Virginia web design and custom software for local businesses. Fast, professional websites that get you found online. Based in Hurricane, WV.',
  openGraph: {
    title: 'Chasing a Chance | Web Design & Custom Software — Hurricane, WV',
    description: 'West Virginia web design and custom software for local businesses. Fast, professional websites that get you found online.',
    url: 'https://chasingachance.com',
    siteName: 'Chasing a Chance',
    images: [{ url: '/website-template-OG.webp' }],
    type: 'website',
  },
}

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post } from '@/payload-types'
import { HomeHero } from '@/components/HomeHero'
import { HomePortfolio } from '@/components/HomePortfolio'
import { HomeCMS } from '@/components/HomeCMS'
import { HomeCMSFeatures } from '@/components/HomeCMSFeatures'
import { HomeLatestNews } from '@/components/HomeLatestNews'
import { HomeCTA } from '@/components/HomeCTA'
import { HomeServices } from '@/components/HomeServices'
import { HomePricing } from '@/components/HomePricing'

async function getData() {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, projectsResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    }).catch(() => ({ docs: [] })),
    payload.find({
      collection: 'projects',
      sort: 'order',
      limit: 12,
      depth: 1,
    }).catch(() => ({ docs: [] })),
  ])

  return {
    posts: postsResult.docs as Post[],
    projects: projectsResult.docs,
  }
}

export default async function HomePage() {
  const { posts, projects } = await getData()

  return (
    <>
      <HomeHero />
<HomeServices />
      <HomeCMS />
      <HomeCMSFeatures />
      <HomePortfolio projects={projects} />
    
      <HomeLatestNews posts={posts} />
      <HomePricing />
      <HomeCTA />
    </>
  )
}
