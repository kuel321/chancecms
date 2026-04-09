import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post, Media } from '@/payload-types'
import { HomeHero } from '@/components/HomeHero'
import { HomePortfolio } from '@/components/HomePortfolio'
import { HomeLatestNews } from '@/components/HomeLatestNews'
import { HomeCTA } from '@/components/HomeCTA'
import { HomeNewsletter } from '@/components/HomeNewsletter'

async function getData() {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, projectsResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    }),
    payload.find({
      collection: 'projects',
      sort: 'order',
      limit: 12,
      depth: 1,
    }),
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
      <HomePortfolio projects={projects} />
      <HomeLatestNews posts={posts} />
      <HomeCTA />
      <HomeNewsletter />
    </>
  )
}
