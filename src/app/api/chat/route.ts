import { NextResponse } from 'next/server'
import { streamText } from 'ai'
import { createServiceClient } from '@/lib/supabase'
import { groq } from '@/lib/groq'
import { embedText } from '@/lib/openai'
import { PLAN_LIMITS } from '@/lib/plans'
import { getCachedResponse, setCachedResponse } from '@/lib/cache'
import { checkRateLimit } from '@/lib/rate-limit'
import { getCurrentUsage, incrementUsage } from '@/lib/usage'
import { notifyOwnerOfLimit } from '@/lib/notifications'
import type { User, ChatMessage, Plan } from '@/types'

export const runtime = 'nodejs'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS })
}

export async function POST(req: Request) {
  try {
    const { botId, messages, domain } = await req.json() as {
      botId: string
      messages: ChatMessage[]
      domain?: string
    }

    if (!botId || !messages?.length) {
      return NextResponse.json({ error: 'botId and messages required' }, { status: 400 })
    }

    const db = createServiceClient()

    // Načti konfiguraci bota
    const { data: bot } = await db
      .from('chatbots')
      .select('*')
      .eq('id', botId)
      .eq('is_active', true)
      .single()

    if (!bot) return NextResponse.json({ error: 'Bot not found or inactive' }, { status: 404 })

    // Validace domény
    if (bot.allowed_domains?.length > 0 && domain) {
      const allowed = bot.allowed_domains.some((d: string) =>
        domain === d || domain.endsWith(`.${d}`) || domain === `www.${d}`
      )
      if (!allowed) return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
    }

    // Zjisti plán vlastníka bota
    const { data: user } = await db
      .from('users')
      .select('plan, message_count_month')
      .eq('id', bot.user_id)
      .single()

    const plan = ((user as User | null)?.plan ?? 'hobby') as Plan
    const limits = PLAN_LIMITS[plan]

    // Rate limit (per-owner, Supabase-backed)
    if (limits.rate_limit) {
      const rateLimited = await checkRateLimit(bot.user_id, limits.rate_limit)
      if (rateLimited) {
        return NextResponse.json(
          { reply: 'Příliš mnoho zpráv najednou. Zkus to za chvíli znovu.' },
          { status: 429, headers: CORS }
        )
      }
    }

    // Měsíční limit zpráv
    const usage = await getCurrentUsage(bot.user_id)
    if (limits.messages_per_month !== Infinity && usage.messageCount >= limits.messages_per_month) {
      // Pošli notifikaci vlastníkovi (max 1x za měsíc)
      notifyOwnerOfLimit(bot.user_id, plan).catch(() => {})

      return NextResponse.json(
        { reply: 'Tento chatbot dosáhl měsíčního limitu zpráv. Vrátí se 1. dne příštího měsíce.' },
        { status: 200, headers: CORS }
      )
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')

    // Cache check (pouze free tier = hobby/free)
    const isFreeplan = plan === 'hobby' || plan === 'free'
    if (isFreeplan && lastUserMessage) {
      const cached = await getCachedResponse(botId, lastUserMessage.content)
      if (cached) {
        incrementUsage(bot.user_id, bot.model).catch(() => {})
        return NextResponse.json({ reply: cached, cached: true }, { headers: CORS })
      }
    }

    // RAG kontext
    let ragContext = ''
    if (lastUserMessage) {
      try {
        if (limits.rag_enabled) {
          // Plný RAG (maker+)
          const embedding = await embedText(lastUserMessage.content)
          const { data: chunks } = await db.rpc('match_chunks', {
            query_embedding: JSON.stringify(embedding),
            match_chatbot_id: botId,
            match_count: 5,
          })
          if (chunks?.length > 0) {
            const relevant = chunks.filter((c: { similarity: number }) => c.similarity > 0.3)
            if (relevant.length > 0) {
              ragContext = `\n\n---\nRelevant knowledge base context:\n\n${relevant.map((c: { content: string }) => c.content).join('\n\n---\n')}\n---`
            }
          }
        } else {
          // Free tier: celý (malý) dokument do context window
          const { data: doc } = await db
            .from('documents')
            .select('content')
            .eq('chatbot_id', botId)
            .maybeSingle()
          if (doc?.content) {
            ragContext = `\n\n---\nKnowledge base:\n\n${doc.content.slice(0, 100_000)}\n---`
          }
        }
      } catch {
        // Selhal RAG, pokračuj bez kontextu
      }
    }

    const systemPrompt = bot.system_prompt + ragContext

    // Volej Groq
    const result = await streamText({
      model: groq(bot.model),
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    // Ulož do cache (free tier)
    if (isFreeplan && lastUserMessage) {
      void result.text.then(text => {
        setCachedResponse(botId, lastUserMessage.content, text).catch(() => {})
      })
    }

    // Zaloguj usage (fire and forget)
    Promise.all([
      incrementUsage(bot.user_id, bot.model),
      db.from('messages').insert([{ chatbot_id: botId, role: 'user', content: lastUserMessage?.content ?? '' }]),
      db.from('chatbots').update({ message_count_month: bot.message_count_month + 1 }).eq('id', botId),
      // Zachovej zpětnou kompatibilitu se starým users.message_count_month polem
      db.from('users').update({ message_count_month: (user as User).message_count_month + 1 }).eq('id', bot.user_id),
    ]).catch(() => {})

    return result.toTextStreamResponse({ headers: CORS })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS })
  }
}
