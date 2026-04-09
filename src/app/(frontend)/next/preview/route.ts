import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const secret = searchParams.get('previewSecret')
  const path = searchParams.get('path')

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  if (!path) {
    return new Response('Missing path', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
