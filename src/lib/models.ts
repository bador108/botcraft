import type { ModelTier } from '@/types'

// groqId — internal only, never expose to users
export const MODELS: Record<ModelTier, {
  groqId: string
  label: string
  description: string
  speed: string
  contextSize: string
}> = {
  fast: {
    groqId: 'llama-3.1-8b-instant',
    label: 'Fast',
    description: 'Okamžité odpovědi pro FAQ a jednoduché dotazy',
    speed: 'Nejrychlejší',
    contextSize: '128k znaků',
  },
  balanced: {
    groqId: 'llama-3.3-70b-versatile',
    label: 'Balanced',
    description: 'Vyvážená kvalita pro komplexní dotazy',
    speed: 'Rychlý',
    contextSize: '131k znaků',
  },
  premium: {
    groqId: 'deepseek-r1-distill-llama-70b',
    label: 'Premium',
    description: 'Nejvyšší kvalita a dlouhé dokumenty',
    speed: 'Standardní',
    contextSize: '262k znaků',
  },
}

/** Map DB-stored model IDs (or old string values) to a ModelTier */
export function legacyModelToTier(model: string): ModelTier {
  if (model === MODELS.fast.groqId || model === 'fast') return 'fast'
  if (model === MODELS.balanced.groqId || model === 'balanced') return 'balanced'
  if (model === MODELS.premium.groqId || model === 'premium') return 'premium'
  // fallback
  return 'fast'
}
