import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for pmOS project (klrrjnzpkvdlfucjrasy).
 * Used by the dashboard to fetch pmOS telemetry data.
 * Read-only access via service role key.
 */

const pmosSupabaseUrl = process.env.PMOS_SUPABASE_URL || '';
const pmosServiceKey = process.env.PMOS_SUPABASE_SERVICE_KEY || '';

const hasValidCredentials =
  pmosSupabaseUrl &&
  pmosServiceKey &&
  pmosSupabaseUrl.includes('supabase.co');

export const supabasePmos: SupabaseClient | null = hasValidCredentials
  ? createClient(pmosSupabaseUrl, pmosServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Check if pmOS Supabase is configured
 */
export function isPmosConfigured(): boolean {
  return supabasePmos !== null;
}
