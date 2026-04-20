import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'

/*
  Vyžaduje tabulku v Supabase (spusť v SQL Editoru):

  CREATE TABLE IF NOT EXISTS contact_submissions (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name       text NOT NULL,
    email      text NOT NULL,
    topic      text NOT NULL,
    message    text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
*/

const schema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  topic:   z.enum(['obecny', 'podpora', 'obchod', 'pr']),
  message: z.string().min(5).max(5000),
})

const TOPIC_LABEL: Record<string, string> = {
  obecny:  'obecný',
  podpora: 'podpora',
  obchod:  'obchod',
  pr:      'PR / média',
}

function getResend() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Resend } = require('resend')
  return new Resend(process.env.RESEND_API_KEY!)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ detail: 'Neplatná data' }, { status: 400 })
    }

    const { name, email, topic, message } = parsed.data

    // 1. Ulož do DB
    const db = createServiceClient()
    await db.from('contact_submissions').insert(parsed.data)

    // 2. Emaily přes Resend (fire-and-forget, nechceme blokovat response)
    if (process.env.RESEND_API_KEY && process.env.SUPPORT_EMAIL) {
      const resend = getResend()
      const from = process.env.FROM_EMAIL ?? 'BotCraft <noreply@botcraft.app>'
      const safeMsg = message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')

      // Notifikace tobě
      resend.emails.send({
        from,
        to: process.env.SUPPORT_EMAIL,
        replyTo: email,
        subject: `[BotCraft ${TOPIC_LABEL[topic] ?? topic}] Nový dotaz od ${name}`,
        html: `
          <p style="font-family:sans-serif;color:#6B6B6B;"><strong>Od:</strong> ${name} &lt;${email}&gt;<br>
          <strong>Typ:</strong> ${TOPIC_LABEL[topic] ?? topic}</p>
          <hr style="border:none;border-top:1px solid #F2F2EF;margin:16px 0;">
          <p style="font-family:sans-serif;color:#0A0A0A;line-height:1.7;">${safeMsg}</p>
          <p style="font-family:sans-serif;color:#A8A8A8;font-size:12px;margin-top:24px;">Odpověz přímo na tento email — uživatel ho dostane.</p>
        `,
      }).catch(() => {})

      // Potvrzení uživateli
      resend.emails.send({
        from,
        to: email,
        replyTo: process.env.SUPPORT_EMAIL,
        subject: 'Díky za zprávu — ozveme se',
        html: `
          <p style="font-family:sans-serif;color:#0A0A0A;">Ahoj ${name},</p>
          <p style="font-family:sans-serif;color:#6B6B6B;line-height:1.7;">
            díky za tvoji zprávu. Ozveme se do 24 hodin (u obchodních dotazů dříve).
          </p>
          <hr style="border:none;border-top:1px solid #F2F2EF;margin:24px 0;">
          <p style="font-family:sans-serif;color:#A8A8A8;font-size:12px;">Tvoje původní zpráva:</p>
          <p style="font-family:sans-serif;color:#6B6B6B;font-size:13px;line-height:1.7;">${safeMsg}</p>
          <p style="font-family:sans-serif;color:#A8A8A8;font-size:12px;margin-top:24px;">Tým BotCraft</p>
        `,
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] unexpected error:', err)
    return NextResponse.json({ detail: 'Interní chyba serveru' }, { status: 500 })
  }
}
