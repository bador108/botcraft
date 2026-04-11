# BotCraft — CLAUDE.md

## Project Overview
**BotCraft** is a SaaS AI chatbot builder with RAG (Retrieval-Augmented Generation) support.
- Next.js 14 App Router + TypeScript + Tailwind CSS
- Auth: Clerk v7
- Payments: Stripe
- Database: Supabase (Postgres + pgvector)
- AI Chat: Groq API via Vercel AI SDK (`@ai-sdk/groq`)
- Embeddings: OpenAI `text-embedding-3-small` (1536-dim)
- PDF parsing: `pdf-parse` (via `require()`, not dynamic import)

## Commands
```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Project Structure
```
src/
  app/
    (auth)/           # sign-in, sign-up (Clerk)
    (dashboard)/      # protected: dashboard, chatbots, billing
    api/
      chat/           # POST — main chat endpoint (Groq + RAG, streaming)
      chatbots/       # GET/POST list; [id]/ GET/PUT/DELETE
      documents/      # POST upload; [id]/ DELETE
      public/chatbots/[id]/  # GET public bot config (no auth)
      stripe/         # checkout POST, webhook POST
      user/           # GET current user plan
    widget/[botId]/   # Chat widget (iframe, no auth, public)
    page.tsx          # Landing page
  components/
    ui/               # Button, Input, Textarea, Select, Badge, Card
    dashboard/        # Sidebar
    chatbot/          # ChatbotForm, KnowledgeBase
  lib/
    supabase.ts       # createClient() + createServiceClient()
    openai.ts         # embedText() — lazy init, no module-level client
    groq.ts           # createGroq() instance
    rag.ts            # chunkText(), extractTextFromFile()
    stripe.ts         # Lazy Stripe proxy — avoids build crash
    plans.ts          # PLAN_LIMITS, MODEL_LABELS
    utils.ts          # cn(), formatDate()
  types/index.ts      # All TypeScript types
public/
  widget.js           # Self-contained embed script
supabase/
  schema.sql          # Full DB schema with pgvector + match_chunks function
```

## Architecture Patterns

### Clerk (v7)
```ts
// Server — always from @clerk/nextjs/server
import { auth, currentUser } from '@clerk/nextjs/server'
const { userId } = await auth()  // auth() is ASYNC

// Client
import { useUser, UserButton } from '@clerk/nextjs'
```
**Never** import `auth` from `@clerk/nextjs` (without /server).

### Supabase Clients
```ts
// Anon (respects RLS):
import { createClient } from '@/lib/supabase'

// Service role (bypasses RLS — use in all API routes):
import { createServiceClient } from '@/lib/supabase'
```
Always use `createServiceClient()` in API routes.

### ensureUser() Pattern
No Clerk webhook. Call this at the top of API routes:
```ts
async function ensureUser(userId: string) {
  const db = createServiceClient()
  const { data } = await db.from('users').select('id').eq('id', userId).single()
  if (!data) {
    const clerkUser = await currentUser()
    await db.from('users').insert({ id: userId, email: ..., full_name: ... })
  }
}
```

### Groq Streaming (AI SDK)
```ts
import { streamText } from 'ai'
import { groq } from '@/lib/groq'

const result = await streamText({
  model: groq('llama-3.1-8b-instant'),
  system: systemPrompt,
  messages: messages,
})
// Use toTextStreamResponse() — NOT toDataStreamResponse() (not available in this version)
return result.toTextStreamResponse()
```

### RAG Pipeline
1. Upload → `extractTextFromFile()` (pdf-parse via require, or UTF-8 decode)
2. `chunkText()` → ~2000-char chunks
3. `embedText()` via OpenAI → `number[]` (1536-dim)
4. Insert into `chunks` table with `JSON.stringify(embedding)`
5. On chat: embed user message → `db.rpc('match_chunks', ...)` → inject top-5 into system prompt

### Widget Embed Flow
1. External site adds: `<script src="https://yourdomain/widget.js" data-bot-id="xxx" async></script>`
2. `widget.js` reads the origin from `document.currentScript.src` — no hardcoded URL
3. Creates iframe pointing to `/widget/[botId]?domain=current.domain`
4. Iframe at `/widget/[botId]` renders `WidgetChat` client component
5. Widget calls `/api/chat` (same-origin from iframe's perspective)
6. Widget sends `postMessage` to parent with `{ type: 'botcraft-theme', color }` to sync button color

### Lazy API Client Init
OpenAI, Stripe MUST be initialized lazily (not at module level) to avoid build-time crashes:
```ts
// CORRECT
function getClient() { return new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) }

// WRONG — crashes at build time
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
```

### PDF Parsing
Use `require()`, not dynamic import with `.default`:
```ts
// CORRECT
const pdfParse = require('pdf-parse')

// WRONG — type error
const pdfParse = (await import('pdf-parse')).default
```

## Plans & Limits
Defined in `src/lib/plans.ts`:
| Plan     | Chatbots | Msgs/month | Docs/bot | Chunks/bot | Models          |
|----------|----------|------------|----------|------------|-----------------|
| free     | 1        | 100        | 1        | 50         | llama-3.1-8b    |
| pro      | 5        | 2000       | 20       | ∞          | all 3 models    |
| business | ∞        | ∞          | ∞        | ∞          | all 3 models    |

## Models
- `llama-3.1-8b-instant` — Basic (free tier)
- `llama-3.3-70b-versatile` — Standard (pro)
- `deepseek-r1-distill-llama-70b` — Advanced (pro)

## Environment Variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=          # For text-embedding-3-small
GROQ_API_KEY=            # For Llama / DeepSeek chat
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=
NEXT_PUBLIC_APP_URL=     # https://yourdomain.com
```

## Supabase Setup
Run `supabase/schema.sql` in the SQL Editor. Key objects:
- `users`, `chatbots`, `documents`, `chunks`, `messages` tables
- `CREATE EXTENSION IF NOT EXISTS vector` (pgvector)
- `match_chunks()` RPC function for similarity search
- RLS enabled on all tables; service role bypasses RLS

## What NOT To Do
1. **Don't init OpenAI/Stripe at module level** — lazy init only
2. **Don't use `toDataStreamResponse()`** — use `toTextStreamResponse()` (this AI SDK version)
3. **Don't use `auth()` synchronously** — always `await auth()`
4. **Don't import Clerk server utils from `@clerk/nextjs`** — use `@clerk/nextjs/server`
5. **Don't use `afterSignOutUrl` on `<UserButton>`** — not supported in Clerk v7
6. **Don't use `(await import('pdf-parse')).default`** — use `require('pdf-parse')`
7. **Don't expose Groq or OpenAI keys to client** — only in server API routes
8. **Don't use the anon Supabase client in API routes** — always service client
9. **Don't add dark: classes to widget** — widget is always light (embedded on unknown sites)
10. **Don't hardcode app URL in widget.js** — derive from `new URL(script.src).origin`
