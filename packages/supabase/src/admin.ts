import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseUrl, validateAdminKey } from './validation';

export interface SupabaseAdminConfig {
  url: string;
  adminKey: string;
}

/**
 * Node.js-compatible Admin Supabase client factory.
 * Used directly by apps/worker or background scripts.
 * Next.js web applications MUST consume this via apps/web/src/lib/supabase/admin.ts which enforces 'server-only'.
 */
export function createAdminClient(config: SupabaseAdminConfig): SupabaseClient {
  const url = validateSupabaseUrl(config?.url);
  const adminKey = validateAdminKey(config?.adminKey, url);

  return createSupabaseClient(url, adminKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
