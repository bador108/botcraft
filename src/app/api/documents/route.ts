import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { chunkText, extractTextFromFile } from '@/lib/rag'
import { embedChunks } from '@/lib/documents/embed'
import { triggerWebhooks } from '@/lib/webhooks/send'
import type { User } from '@/types'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const url = new URL(req.url)
  const chatbotId = url.searchParams.get('chatbotId')

  let query = db
    .from('documents')
    .select('*, chatbots(id, name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (chatbotId) {
    query = query.eq('chatbot_id', chatbotId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()

  // Zjistíme plán uživatele
  const { data: user } = await db.from('users').select('plan').eq('id', userId).single()
  const plan = (user as User | null)?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]

  let chatbotId: string
  let rawText: string
  let docName: string
  let fileType: string | undefined
  let fileSizeBytes: number | undefined

  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const fd = await req.formData()
    chatbotId = fd.get('chatbotId') as string
    const file = fd.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Soubor je příliš velký (max 10 MB)' }, { status: 400 })

    docName = file.name
    fileType = file.name.split('.').pop()?.toLowerCase()
    fileSizeBytes = file.size
    const buffer = Buffer.from(await file.arrayBuffer())
    rawText = await extractTextFromFile(buffer, file.type, file.name)
  } else {
    const body = await req.json()
    chatbotId = body.chatbotId
    rawText = body.text
    docName = body.name
  }

  if (!chatbotId) return NextResponse.json({ error: 'chatbotId required' }, { status: 400 })

  // Ověřit vlastnictví chatbota
  const { data: bot } = await db.from('chatbots').select('id').eq('id', chatbotId).eq('user_id', userId).single()
  if (!bot) return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })

  // Zkontrolovat limit dokumentů
  const { count: docCount } = await db
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId)

  if (limits.documents_per_chatbot !== Infinity && (docCount ?? 0) >= limits.documents_per_chatbot) {
    return NextResponse.json({ error: 'Dosáhl jsi limitu dokumentů pro tvůj plán.' }, { status: 403 })
  }

  // Zkontrolovat limit chunků
  const { count: chunkCount } = await db
    .from('chunks')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId)

  const chunks = chunkText(rawText)

  const allowedChunks = limits.chunks_per_chatbot === Infinity
    ? chunks
    : chunks.slice(0, Math.max(0, limits.chunks_per_chatbot - (chunkCount ?? 0)))

  if (allowedChunks.length === 0) {
    return NextResponse.json({ error: 'Dosáhl jsi limitu chunků. Upgraduj plán.' }, { status: 403 })
  }

  // Vytvoř záznam dokumentu
  const { data: doc, error: docError } = await db.from('documents').insert({
    chatbot_id: chatbotId,
    user_id: userId,
    name: docName,
    chunk_count: allowedChunks.length,
    file_type: fileType,
    file_size_bytes: fileSizeBytes,
    status: 'ready',
  }).select().single()

  if (docError || !doc) return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })

  // Embed všechny chunky najednou (Cohere dávkuje po 96)
  const embeddings = await embedChunks(allowedChunks)

  await db.from('chunks').insert(
    allowedChunks.map((content, i) => ({
      document_id: doc.id,
      chatbot_id: chatbotId,
      content,
      embedding: JSON.stringify(embeddings[i]),
    }))
  )

  triggerWebhooks(userId, 'document.uploaded', {
    document_id: doc.id,
    name: docName,
    chatbot_id: chatbotId,
    chunks: allowedChunks.length,
  }).catch(() => {})

  return NextResponse.json(doc, { status: 201 })
}
