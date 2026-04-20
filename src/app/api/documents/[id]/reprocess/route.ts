import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { chunkText } from '@/lib/rag'
import { embedText } from '@/lib/openai'

export const maxDuration = 60

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServiceClient()

  // Verify ownership
  const { data: doc } = await db
    .from('documents')
    .select('id, chatbot_id, user_id, name')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Get existing chunks to reconstruct text
  const { data: chunks } = await db
    .from('chunks')
    .select('content')
    .eq('document_id', id)
    .order('created_at', { ascending: true })

  if (!chunks?.length) {
    return NextResponse.json({ error: 'Žádný obsah k přepracování' }, { status: 400 })
  }

  // Rebuild full text from chunks
  const fullText = chunks.map(c => c.content).join('\n\n')

  // Delete old chunks
  await db.from('chunks').delete().eq('document_id', id)

  // Re-chunk and re-embed
  const newChunks = chunkText(fullText)
  const embeddings = await Promise.all(newChunks.map(c => embedText(c)))

  const rows = newChunks.map((content, i) => ({
    document_id: id,
    chatbot_id: doc.chatbot_id,
    user_id: userId,
    content,
    embedding: JSON.stringify(embeddings[i]),
  }))

  const { error } = await db.from('chunks').insert(rows)
  if (error) return NextResponse.json({ error: 'Reprocessing failed' }, { status: 500 })

  // Update chunk count
  await db.from('documents').update({ chunk_count: rows.length }).eq('id', id)

  return NextResponse.json({ success: true, chunks: rows.length })
}
