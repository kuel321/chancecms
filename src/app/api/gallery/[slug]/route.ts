import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { gallerySessionCookieName, gallerySessionMaxAge, signGallerySession } from '@/utilities/gallerySession'
import { verifyPassword } from '@/utilities/password'

type Params = { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const body = await req.json().catch(() => null)
  const password = body?.password

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'galleries',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const gallery = result.docs[0]

  if (!gallery || !gallery.passwordHash || !verifyPassword(password, gallery.passwordHash)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(gallerySessionCookieName(gallery.id), signGallerySession(gallery.id), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: gallerySessionMaxAge,
  })
  return response
}
