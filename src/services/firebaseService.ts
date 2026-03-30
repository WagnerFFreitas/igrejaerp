// ESTE ARQUIVO FOI MANTIDO PARA COMPATIBILIDADE
// O projeto agora usa Supabase em vez de Firebase
// Para novos desenvolvimentos, importe diretamente de '@/lib/supabase/client'

import { createClient, isSupabaseConfigured } from '../../lib/supabase/client';

// Re-exportar o cliente Supabase como 'db' para compatibilidade
const supabase = createClient();

// Exportar como 'db' para manter compatibilidade com código existente
export const db = supabase;
export const auth = supabase?.auth;
export const storage = supabase?.storage;
export const functions = null; // Supabase usa Edge Functions

// Verificar se está configurado
export const isConfigured = isSupabaseConfigured;

// Log de inicialização
if (supabase) {
  console.log("Supabase inicializado com sucesso (compatibilidade Firebase)");
} else {
  console.warn("Supabase nao configurado. Verifique as variaveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY");
}

export default supabase;
