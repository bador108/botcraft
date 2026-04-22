import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon']
const MAX_SIZE = 512 * 1024 // 512 KB

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()

  // Ověř vlastnictví chatbota
  const { data: bot } = await db
    .from('chatbots')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'Soubor chybí' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Nepodporovaný formát. Povolen PNG, JPG, WebP, GIF, SVG, ICO.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Soubor je příliš velký. Maximum je 512 KB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'png'
  const path = `${userId}/${params.id}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await db.storage
    .from('bot-avatars')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('Avatar upload error:', uploadError)
    return NextResponse.json({ error: 'Upload selhal. Zkontroluj že bucket bot-avatars existuje.' }, { status: 500 })
  }

  const { data: { publicUrl } } = db.storage.from('bot-avatars').getPublicUrl(path)

  // Ulož URL do chatbota
  await db.from('chatbots').update({ avatar: publicUrl }).eq('id', params.id)

  return NextResponse.json({ avatar: publicUrl })
}
