import crypto from 'crypto'

const COOKIE_PREFIX = 'gallery_auth_'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set')
  return secret
}

export function gallerySessionCookieName(galleryId: string | number): string {
  return `${COOKIE_PREFIX}${galleryId}`
}

export function signGallerySession(galleryId: string | number): string {
  return crypto.createHmac('sha256', getSecret()).update(String(galleryId)).digest('hex')
}

export function verifyGallerySession(galleryId: string | number, token: string | undefined): boolean {
  if (!token) return false

  const expected = signGallerySession(galleryId)
  const expectedBuffer = Buffer.from(expected)
  const tokenBuffer = Buffer.from(token)
  if (expectedBuffer.length !== tokenBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, tokenBuffer)
}

export const gallerySessionMaxAge = MAX_AGE
