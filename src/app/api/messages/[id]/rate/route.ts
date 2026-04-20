import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { rating } = await req.json() as { rating: number }

  if (![1, -1].includes(rating)) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  }

  const db = createServiceClient()
  await db.from('messages').update({ rating }).eq('id', id).eq('role', 'assistant')

  return NextResponse.json({ success: true })
}
