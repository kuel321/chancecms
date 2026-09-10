import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'

import type { ClientFile, Gallery } from '@/payload-types'
import { gallerySessionCookieName, verifyGallerySession } from '@/utilities/gallerySession'
import { GalleryPasswordForm } from '@/components/GalleryPasswordForm'
import { GalleryView } from '@/components/GalleryView'

type Props = {
  params: Promise<{ slug: string }>
}

async function getGallery(slug: string): Promise<Gallery | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'galleries',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return (result.docs[0] as Gallery) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const gallery = await getGallery(slug)
  if (!gallery) return {}

  return {
    title: `${gallery.title} | Client Gallery`,
    robots: { index: false, follow: false },
  }
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params
  const gallery = await getGallery(slug)

  if (!gallery) notFound()

  const cookieStore = await cookies()
  const token = cookieStore.get(gallerySessionCookieName(gallery.id))?.value
  const authorized = verifyGallerySession(gallery.id, token)

  if (!authorized) {
    return (
      <div style={{ background: 'var(--color-cream)', minHeight: '70vh' }}>
        <GalleryPasswordForm slug={slug} title={gallery.title} />
      </div>
    )
  }

  const files = (gallery.files ?? []).filter(
    (file): file is ClientFile => typeof file === 'object' && file !== null,
  )

  return (
    <div style={{ background: 'var(--color-cream)' }}>
      <GalleryView title={gallery.title} note={gallery.note} slug={slug} files={files} />
    </div>
  )
}
