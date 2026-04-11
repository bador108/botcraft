import type { Plan, PlanLimits, ChatModel } from '@/types'

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    chatbots: 1,
    messages_per_month: 100,
    documents_per_chatbot: 1,
    chunks_per_chatbot: 50,
    models: ['llama-3.1-8b-instant'],
  },
  pro: {
    chatbots: 5,
    messages_per_month: 2000,
    documents_per_chatbot: 20,
    chunks_per_chatbot: Infinity,
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b'],
  },
  business: {
    chatbots: Infinity,
    messages_per_month: Infinity,
    documents_per_chatbot: Infinity,
    chunks_per_chatbot: Infinity,
    models: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b'],
  },
}

export const MODEL_LABELS: Record<ChatModel, { label: string; tier: string; description: string }> = {
  'llama-3.1-8b-instant': {
    label: 'Basic',
    tier: 'Free',
    description: 'Fast, great for simple Q&A',
  },
  'llama-3.3-70b-versatile': {
    label: 'Standard',
    tier: 'Pro',
    description: 'Smarter, better reasoning',
  },
  'deepseek-r1-distill-llama-70b': {
    label: 'Advanced',
    tier: 'Pro',
    description: 'Complex tasks, best quality',
  },
}

export const PLAN_PRICES = {
  pro: 9,
  business: 29,
}
