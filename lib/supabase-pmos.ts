import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for pmOS read-only analytics access.
 * Uses anon key (not service key) for scoped read access.
 */

const supabaseUrl = process.env.PMOS_SUPABASE_URL || '';
const anonKey = process.env.PMOS_SUPABASE_ANON_KEY || '';

const hasValidCredentials =
  supabaseUrl &&
  anonKey &&
  supabaseUrl.includes('supabase.co');

export const supabasePmos: SupabaseClient | null = hasValidCredentials
  ? createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export function isPmosConfigured(): boolean {
  return supabasePmos !== null;
}
