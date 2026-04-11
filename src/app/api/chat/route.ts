import { NextResponse } from 'next/server'
import { streamText } from 'ai'
import { createServiceClient } from '@/lib/supabase'
import { groq } from '@/lib/groq'
import { embedText } from '@/lib/openai'
import { PLAN_LIMITS } from '@/lib/plans'
import type { User, ChatMessage } from '@/types'

export const runtime = 'nodejs'

// Simple in-memory rate limiter (per botId, max 20 req/min)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(botId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(botId)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(botId, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
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

    // Rate limit
    if (!checkRateLimit(botId)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const db = createServiceClient()

    // Fetch bot config
    const { data: bot } = await db
      .from('chatbots')
      .select('*')
      .eq('id', botId)
      .eq('is_active', true)
      .single()

    if (!bot) return NextResponse.json({ error: 'Bot not found or inactive' }, { status: 404 })

    // Domain validation
    if (bot.allowed_domains?.length > 0 && domain) {
      const allowed = bot.allowed_domains.some((d: string) =>
        domain === d || domain.endsWith(`.${d}`) || domain === `www.${d}`
      )
      if (!allowed) return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
    }

    // Check message limits for bot owner
    const { data: user } = await db.from('users').select('plan, message_count_month').eq('id', bot.user_id).single()
    const plan = (user as User | null)?.plan ?? 'free'
    const limits = PLAN_LIMITS[plan]

    if (limits.messages_per_month !== Infinity && (user as User).message_count_month >= limits.messages_per_month) {
      return NextResponse.json({ error: 'Monthly message limit reached' }, { status: 429 })
    }

    // RAG: embed last user message and find relevant chunks
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    let ragContext = ''

    if (lastUserMessage) {
      try {
        const embedding = await embedText(lastUserMessage.content)
        const { data: chunks } = await db.rpc('match_chunks', {
          query_embedding: JSON.stringify(embedding),
          match_chatbot_id: botId,
          match_count: 5,
        })

        if (chunks && chunks.length > 0) {
          const relevant = chunks.filter((c: { similarity: number }) => c.similarity > 0.3)
          if (relevant.length > 0) {
            ragContext = `\n\n---\nRelevant knowledge base context (use this to answer the user's question):\n\n${relevant.map((c: { content: string }) => c.content).join('\n\n---\n')}\n---`
          }
        }
      } catch {
        // If embedding fails, continue without RAG
      }
    }

    const systemPrompt = bot.system_prompt + ragContext

    // Stream response via Groq
    const result = await streamText({
      model: groq(bot.model),
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    // Log message counts (fire and forget)
    const lastMsg = lastUserMessage?.content ?? ''
    Promise.all([
      db.from('messages').insert([
        { chatbot_id: botId, role: 'user', content: lastMsg },
      ]),
      db.from('users')
        .update({ message_count_month: (user as User).message_count_month + 1 })
        .eq('id', bot.user_id),
      db.from('chatbots')
        .update({ message_count_month: bot.message_count_month + 1 })
        .eq('id', botId),
    ]).catch(() => {}) // ignore logging errors

    return result.toTextStreamResponse()
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
