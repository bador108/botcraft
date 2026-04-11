import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { chunkText, extractTextFromFile } from '@/lib/rag'
import { embedText } from '@/lib/openai'
import type { User } from '@/types'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()

  // Get user plan
  const { data: user } = await db.from('users').select('plan').eq('id', userId).single()
  const plan = (user as User | null)?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]

  let chatbotId: string
  let rawText: string
  let docName: string

  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const fd = await req.formData()
    chatbotId = fd.get('chatbotId') as string
    const file = fd.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })

    docName = file.name
    const buffer = Buffer.from(await file.arrayBuffer())
    rawText = await extractTextFromFile(buffer, file.type, file.name)
  } else {
    const body = await req.json()
    chatbotId = body.chatbotId
    rawText = body.text
    docName = body.name
  }

  if (!chatbotId) return NextResponse.json({ error: 'chatbotId required' }, { status: 400 })

  // Verify chatbot belongs to user
  const { data: bot } = await db.from('chatbots').select('id').eq('id', chatbotId).eq('user_id', userId).single()
  if (!bot) return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })

  // Check document limits
  const { count: docCount } = await db
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId)

  if (limits.documents_per_chatbot !== Infinity && (docCount ?? 0) >= limits.documents_per_chatbot) {
    return NextResponse.json({ error: 'Document limit reached for your plan.' }, { status: 403 })
  }

  // Check chunk limits
  const { count: chunkCount } = await db
    .from('chunks')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId)

  // Chunk the text
  const chunks = chunkText(rawText)

  // Respect chunk limit
  const allowedChunks = limits.chunks_per_chatbot === Infinity
    ? chunks
    : chunks.slice(0, Math.max(0, limits.chunks_per_chatbot - (chunkCount ?? 0)))

  if (allowedChunks.length === 0) {
    return NextResponse.json({ error: 'Chunk limit reached. Upgrade to add more content.' }, { status: 403 })
  }

  // Create document record
  const { data: doc, error: docError } = await db.from('documents').insert({
    chatbot_id: chatbotId,
    user_id: userId,
    name: docName,
    chunk_count: allowedChunks.length,
  }).select().single()

  if (docError || !doc) return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })

  // Embed and insert chunks in batches of 10
  const BATCH = 10
  for (let i = 0; i < allowedChunks.length; i += BATCH) {
    const batch = allowedChunks.slice(i, i + BATCH)
    const embeddings = await Promise.all(batch.map(c => embedText(c)))

    await db.from('chunks').insert(
      batch.map((content, j) => ({
        document_id: doc.id,
        chatbot_id: chatbotId,
        content,
        embedding: JSON.stringify(embeddings[j]),
      }))
    )
  }

  return NextResponse.json(doc, { status: 201 })
}
