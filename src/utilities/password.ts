import crypto from 'crypto'

const KEY_LENGTH = 64

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false

  const hashBuffer = Buffer.from(hash, 'hex')
  const suppliedBuffer = crypto.scryptSync(password, salt, KEY_LENGTH)
  if (hashBuffer.length !== suppliedBuffer.length) return false

  return crypto.timingSafeEqual(hashBuffer, suppliedBuffer)
}
