import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseServerConfig {
  supabaseUrl?: string;
  publishableKey?: string;
}

export function createServerClient(config?: SupabaseServerConfig): SupabaseClient {
  const url = config?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'http://127.0.0.1:54321';
  const key =
    config?.publishableKey || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_placeholder';

  return createSupabaseClient(url, key);
}
