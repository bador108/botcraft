import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Anon client (respects RLS)
export function createClient() {
  return createSupabaseClient(url, anonKey)
}

// Service client (bypasses RLS — use in API routes only)
export function createServiceClient() {
  return createSupabaseClient(url, serviceKey)
}
