import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const maxDuration = 60

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()

  const [
    { data: preferences },
    { data: subscription },
    { data: chatbots },
    { data: documents },
    { data: messages },
    { data: invoices },
  ] = await Promise.all([
    db.from('user_preferences').select('*').eq('user_id', userId).maybeSingle(),
    db.from('subscriptions').select('*').eq('user_id', userId).maybeSingle(),
    db.from('chatbots').select('id, name, system_prompt, model, is_active, created_at').eq('user_id', userId),
    db.from('documents').select('id, name, file_type, file_size_bytes, created_at').eq('user_id', userId),
    db.from('messages').select('id, chatbot_id, session_id, role, content, rating, created_at').eq('user_id', userId).limit(50000),
    db.from('invoices').select('*').eq('user_id', userId),
  ])

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const JSZip = require('jszip')
  const zip = new JSZip()

  zip.file('profile.json', JSON.stringify(preferences, null, 2))
  zip.file('subscription.json', JSON.stringify(subscription, null, 2))
  zip.file('chatbots.json', JSON.stringify(chatbots, null, 2))
  zip.file('documents.json', JSON.stringify(documents, null, 2))
  zip.file('messages.json', JSON.stringify(messages, null, 2))
  zip.file('invoices.json', JSON.stringify(invoices, null, 2))
  zip.file('README.txt', [
    'BotCraft — Export osobních dat',
    '',
    `Datum: ${new Date().toISOString()}`,
    `User ID: ${userId}`,
    '',
    'Obsah exportu:',
    '  profile.json     — preference uživatele',
    '  subscription.json — aktivní předplatné',
    '  chatbots.json    — všechny chatboty',
    '  documents.json   — nahraté dokumenty (bez obsahu)',
    '  messages.json    — konverzace (max 50 000 zpráv)',
    '  invoices.json    — fakturační historie',
    '',
    'Tento export byl vytvořen v souladu s GDPR čl. 20 (přenositelnost dat).',
  ].join('\n'))

  const buffer: Buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

  // Upload do Supabase Storage
  const path = `exports/${userId}/${Date.now()}.zip`
  const { error: uploadError } = await db.storage.from('exports').upload(path, buffer, {
    contentType: 'application/zip',
    upsert: false,
  })

  if (uploadError) {
    // Fallback: vrať jako přímý download (pokud bucket neexistuje)
    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="botcraft-export-${userId.slice(0, 8)}.zip"`,
      },
    })
  }

  const { data: signed } = await db.storage
    .from('exports')
    .createSignedUrl(path, 7 * 24 * 60 * 60) // 7 dní

  return NextResponse.json({ downloadUrl: signed?.signedUrl ?? null })
}
