import 'server-only';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseAdminConfig {
  supabaseUrl?: string;
  secretKey?: string;
}

/**
 * Administrative Supabase Client Factory.
 * MUST ONLY be called from server/worker environments.
 * CANNOT be imported in client-side web or Expo driver code.
 */
export function createAdminClient(config?: SupabaseAdminConfig): SupabaseClient {
  const url = config?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'http://127.0.0.1:54321';
  const secretKey = config?.secretKey || process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('[Supabase Admin Client] SUPABASE_SECRET_KEY is missing from environment.');
  }

  return createSupabaseClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
