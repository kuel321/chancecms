import 'dotenv/config'
import { spawn } from 'node:child_process'
import fs from 'node:fs'

if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))
  throw new Error('A Stripe sandbox key is required')
const origin = process.env.STRIPE_SANDBOX_ORIGIN || 'http://localhost:3002'
if (!/^http:\/\/localhost:\d+$/.test(origin))
  throw new Error('Use a localhost origin for sandbox forwarding')
const args = [
  'exec',
  '--yes',
  '--package=@stripe/cli',
  '--',
  'stripe',
  'listen',
  '--latest',
  '--forward-to',
  `${origin}/api/stripe/webhook`,
]
const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
  shell: process.platform === 'win32',
  env: { ...process.env, STRIPE_API_KEY: process.env.STRIPE_SECRET_KEY },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let buffered = ''
function output(chunk) {
  buffered += chunk.toString()
  let end
  while ((end = buffered.indexOf('\n')) >= 0) {
    const line = buffered.slice(0, end)
    buffered = buffered.slice(end + 1)
    const secret = line.match(/whsec_[a-zA-Z0-9]+/)?.[0]
    if (secret) {
      let env = fs.readFileSync('.env', 'utf8')
      env = /^STRIPE_WEBHOOK_SECRET=.*$/m.test(env)
        ? env.replace(/^STRIPE_WEBHOOK_SECRET=.*$/m, `STRIPE_WEBHOOK_SECRET=${secret}`)
        : `${env}\nSTRIPE_WEBHOOK_SECRET=${secret}\n`
      fs.writeFileSync('.env', env)
    }
    console.log(line.replace(/whsec_[a-zA-Z0-9]+/g, '[saved to local .env]'))
  }
}
child.stdout.on('data', output)
child.stderr.on('data', output)
child.on('exit', (code) => {
  process.exitCode = code ?? 0
})
process.on('SIGINT', () => child.kill())
process.on('SIGTERM', () => child.kill())
