import type { Plan, PlanLimits, ChatModel } from '@/types'

export const OWNER_EMAIL = 'vaclav.urbanec2@gmail.com'

/** Vlastník má vždy enterprise plán bez ohledu na Stripe */
export function getEffectivePlan(plan: Plan, email?: string | null): Plan {
  if (email === OWNER_EMAIL) return 'enterprise'
  return plan
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  // ── Nová struktura plánů ────────────────────────────────────────
  hobby: {
    chatbots: 1,
    messages_per_month: 50,
    documents_per_chatbot: 1,
    chunks_per_chatbot: 50,
    models: ['llama-3.1-8b-instant'],
    rag_enabled: false,
    analytics: false,
    csv_export: false,
    custom_branding: false,
    remove_badge: false,
    rate_limit: { requests: 5, window_seconds: 60 },
  },
  maker: {
    chatbots: 5,
    messages_per_month: 4000,
    documents_per_chatbot: 20,
    chunks_per_chatbot: Infinity,
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'],
    rag_enabled: true,
    analytics: true,
    csv_export: true,
    custom_branding: true,
    remove_badge: true,
    rate_limit: { requests: 30, window_seconds: 60 },
  },
  studio: {
    chatbots: Infinity,
    messages_per_month: 15000,
    premium_model_limit: 2000,
    documents_per_chatbot: Infinity,
    chunks_per_chatbot: Infinity,
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b'],
    rag_enabled: true,
    analytics: true,
    csv_export: true,
    custom_branding: true,
    remove_badge: true,
    custom_domain: true,
    api_keys: true,
    webhooks: true,
    ab_testing: true,
    team_seats: 3,
    white_label: true,
    rate_limit: { requests: 100, window_seconds: 60 },
  },
  enterprise: {
    chatbots: Infinity,
    messages_per_month: Infinity,
    documents_per_chatbot: Infinity,
    chunks_per_chatbot: Infinity,
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b'],
    rag_enabled: true,
    analytics: true,
    csv_export: true,
    custom_branding: true,
    remove_badge: true,
    custom_domain: true,
    api_keys: true,
    webhooks: true,
    ab_testing: true,
    team_seats: Infinity,
    white_label: true,
    self_hosted: true,
    rate_limit: { requests: 500, window_seconds: 60 },
  },
  // ── Legacy aliasy (backward compat se Stripe webhooky) ──────────
  free: {
    chatbots: 1,
    messages_per_month: 50,
    documents_per_chatbot: 1,
    chunks_per_chatbot: 50,
    models: ['llama-3.1-8b-instant'],
    rag_enabled: false,
    analytics: false,
    csv_export: false,
    custom_branding: false,
    remove_badge: false,
    rate_limit: { requests: 5, window_seconds: 60 },
  },
  pro: {
    chatbots: 5,
    messages_per_month: 4000,
    documents_per_chatbot: 20,
    chunks_per_chatbot: Infinity,
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'],
    rag_enabled: true,
    analytics: true,
    csv_export: true,
    custom_branding: true,
    remove_badge: true,
    rate_limit: { requests: 30, window_seconds: 60 },
  },
  business: {
    chatbots: Infinity,
    messages_per_month: Infinity,
    documents_per_chatbot: Infinity,
    chunks_per_chatbot: Infinity,
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b'],
    rag_enabled: true,
    analytics: true,
    csv_export: true,
    custom_branding: true,
    remove_badge: true,
    rate_limit: { requests: 200, window_seconds: 60 },
  },
}

export const MODEL_LABELS: Record<ChatModel, { label: string; tier: string; description: string }> = {
  'llama-3.1-8b-instant': {
    label: 'Fast',
    tier: 'Hobby',
    description: 'Okamžité odpovědi, ideální pro FAQ',
  },
  'llama-3.3-70b-versatile': {
    label: 'Balanced',
    tier: 'Maker',
    description: 'Vyvážená kvalita a rychlost',
  },
  'deepseek-r1-distill-llama-70b': {
    label: 'Premium',
    tier: 'Studio',
    description: 'Komplexní dotazy, dlouhé dokumenty',
  },
}

export const PLAN_PRICES = {
  maker: 490,
  studio: 1290,
}
