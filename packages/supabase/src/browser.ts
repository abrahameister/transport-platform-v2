import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseBrowserConfig {
  supabaseUrl?: string;
  publishableKey?: string;
}

export function createBrowserClient(config?: SupabaseBrowserConfig): SupabaseClient {
  const url =
    config?.supabaseUrl ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'http://127.0.0.1:54321';
  const key =
    config?.publishableKey ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_placeholder';

  if (!url) {
    throw new Error('[Supabase Browser Client] Supabase URL is missing.');
  }
  return createSupabaseClient(url, key);
}
