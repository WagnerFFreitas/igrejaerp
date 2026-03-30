import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL ou Anon Key não configurados. Execute em modo offline.')
}

let supabase: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabase
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

export { supabase }
