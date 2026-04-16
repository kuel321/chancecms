import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

function buildEmail(data: {
  name: string
  email: string
  phone: string
  service: string
  message: string
  contactMethods?: string[]
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Georgia, serif; background: #faf5ec; margin: 0; padding: 0; }
    .wrap { max-width: 600px; margin: 40px auto; background: #f4ead4; border: 1px solid #ddd3bb; }
    .header { background: #002202; padding: 32px 40px; }
    .header h1 { color: #f0e0c7; font-size: 20px; font-weight: 400; margin: 0; letter-spacing: 0.05em; }
    .header p { color: rgba(240,224,199,0.45); font-size: 11px; margin: 6px 0 0; letter-spacing: 0.2em; text-transform: uppercase; font-family: Arial, sans-serif; }
    .body { padding: 40px; }
    .field { margin-bottom: 24px; }
    .label { font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 4px; }
    .value { font-size: 16px; color: #002202; line-height: 1.6; }
    .message-box { background: #faf5ec; border: 1px solid #ddd3bb; padding: 20px 24px; margin-top: 8px; }
    .tag { display: inline-block; background: #f15a24; color: #fff; font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; }
    .footer { border-top: 1px solid #ddd3bb; padding: 20px 40px; }
    .footer p { font-family: Arial, sans-serif; font-size: 11px; color: #aaa; margin: 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>New Project Inquiry</h1>
      <p>Chasing a Chance — chasingachance.com</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Service</div>
        <div class="value"><span class="tag">${data.service}</span></div>
      </div>
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${data.email}" style="color:#00260f;">${data.email}</a></div>
      </div>
      ${data.phone ? `
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${data.phone}</div>
      </div>` : ''}
      ${data.contactMethods?.length ? `
      <div class="field">
        <div class="label">Preferred Contact</div>
        <div class="value">${data.contactMethods.join(', ')}</div>
      </div>` : ''}
      ${data.message ? `
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box value">${data.message.replace(/\n/g, '<br/>')}</div>
      </div>` : ''}
    </div>
    <div class="footer">
      <p>Sent from the contact form at chasingachance.com</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, service, message, contactMethods } = body

  if (!name || !email || !service) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    await transporter.sendMail({
      from: `"Chasing a Chance" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New inquiry: ${service} — ${name}`,
      html: buildEmail({ name, email, phone, service, message, contactMethods }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Email send failed:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
