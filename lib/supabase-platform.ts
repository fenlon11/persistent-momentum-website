import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for the Persistent Momentum platform project (klrrjnzpkvdlfucjrasy).
 * Used by the dashboard to fetch platform telemetry data.
 * Read-only access via service role key.
 */

const platformSupabaseUrl = process.env.PMOS_SUPABASE_URL || '';
const platformServiceKey = process.env.PMOS_SUPABASE_SERVICE_KEY || '';

const hasValidCredentials =
  platformSupabaseUrl &&
  platformServiceKey &&
  platformSupabaseUrl.includes('supabase.co');

export const supabasePlatform: SupabaseClient | null = hasValidCredentials
  ? createClient(platformSupabaseUrl, platformServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Check if Platform Supabase is configured
 */
export function isPlatformConfigured(): boolean {
  return supabasePlatform !== null;
}
