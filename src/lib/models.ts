import type { ModelTier } from '@/types'

export const MODELS: Record<ModelTier, { groqId: string; label: string; description: string }> = {
  fast: {
    groqId: 'llama-3.1-8b-instant',
    label: 'Fast',
    description: 'Okamžité odpovědi',
  },
  balanced: {
    groqId: 'llama-3.3-70b-versatile',
    label: 'Balanced',
    description: 'Vyvážená kvalita',
  },
  premium: {
    // TODO: Ověřit aktuální model ID na https://api.groq.com/openai/v1/models
    groqId: 'deepseek-r1-distill-llama-70b',
    label: 'Premium',
    description: 'Dlouhé dokumenty',
  },
}
