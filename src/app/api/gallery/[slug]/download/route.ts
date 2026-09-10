import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ZipArchive } from 'archiver'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'

import { gallerySessionCookieName, verifyGallerySession } from '@/utilities/gallerySession'
import type { ClientFile } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'galleries',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const gallery = result.docs[0]
  if (!gallery) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(gallerySessionCookieName(gallery.id))?.value
  if (!verifyGallerySession(gallery.id, token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const files = (gallery.files ?? []).filter(
    (file): file is ClientFile => typeof file === 'object' && file !== null,
  )

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files in this gallery' }, { status: 404 })
  }

  const archive = new ZipArchive({ zlib: { level: 9 } })
  const usedNames = new Set<string>()

  for (const file of files) {
    if (!file.filename) continue
    const filePath = path.join(process.cwd(), 'public/client-files', file.filename)
    if (!fs.existsSync(filePath)) continue

    let entryName = file.filename
    let n = 1
    while (usedNames.has(entryName)) {
      const ext = path.extname(file.filename)
      entryName = `${path.basename(file.filename, ext)} (${n})${ext}`
      n += 1
    }
    usedNames.add(entryName)
    archive.file(filePath, { name: entryName })
  }

  archive.finalize()

  const safeName = gallery.title.replace(/[^a-z0-9-_]+/gi, '-') || 'gallery'
  const webStream = Readable.toWeb(archive) as ReadableStream

  return new NextResponse(webStream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${safeName}.zip"`,
    },
  })
}
