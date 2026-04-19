export type Plan = 'free' | 'pro' | 'business' | 'hobby' | 'maker' | 'studio' | 'enterprise'
export type ChatModel = 'llama-3.1-8b-instant' | 'llama-3.3-70b-versatile' | 'deepseek-r1-distill-llama-70b'
export type ModelTier = 'fast' | 'balanced' | 'premium'

export interface User {
  id: string
  email: string
  full_name: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  message_count_month: number
  message_count_reset_at: string
  created_at: string
}

export interface Chatbot {
  id: string
  user_id: string
  name: string
  avatar: string
  system_prompt: string
  model: ChatModel
  theme_color: string
  welcome_message: string
  allowed_domains: string[]
  is_active: boolean
  message_count_month: number
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  chatbot_id: string
  user_id: string
  name: string
  chunk_count: number
  created_at: string
}

export interface Chunk {
  id: string
  document_id: string
  chatbot_id: string
  content: string
  created_at: string
}

export interface Message {
  id: string
  chatbot_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface PlanLimits {
  chatbots: number
  messages_per_month: number
  documents_per_chatbot: number
  chunks_per_chatbot: number
  models: ChatModel[]
  rag_enabled?: boolean
  analytics?: boolean
  csv_export?: boolean
  custom_branding?: boolean
  remove_badge?: boolean
  custom_domain?: boolean
  webhooks?: boolean
  ab_testing?: boolean
  team_seats?: number
  white_label?: boolean
  self_hosted?: boolean
  premium_model_limit?: number
  rate_limit?: { requests: number; window_seconds: number }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
