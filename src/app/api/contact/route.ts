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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ detail: 'Neplatná data' }, { status: 400 })
    }

    const db = createServiceClient()
    const { error } = await db.from('contact_submissions').insert(parsed.data)

    if (error) {
      console.error('[contact] supabase error:', error)
      return NextResponse.json({ detail: 'Chyba při ukládání' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] unexpected error:', err)
    return NextResponse.json({ detail: 'Interní chyba serveru' }, { status: 500 })
  }
}
