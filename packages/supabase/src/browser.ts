import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseUrl, validatePublishableKey } from './validation';

export interface SupabaseBrowserConfig {
  url: string;
  publishableKey: string;
}

export function createBrowserClient(config: SupabaseBrowserConfig): SupabaseClient {
  const url = validateSupabaseUrl(config?.url);
  const key = validatePublishableKey(config?.publishableKey, url, 'browser');

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
      detectSessionInUrl: typeof window !== 'undefined',
    },
  });
}
