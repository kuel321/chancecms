import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const url = getServerSideURL()

  const posts = await payload
    .find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })
    .catch(() => ({ docs: [] }))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.docs.map(post => `  <url>
    <loc>${url}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt as string).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
