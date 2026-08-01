import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseUrl, validatePublishableKey } from './validation';

export interface SupabaseNativeConfig {
  url: string;
  publishableKey: string;
}

export function createNativeClient(config: SupabaseNativeConfig): SupabaseClient {
  const url = validateSupabaseUrl(config?.url);
  const key = validatePublishableKey(config?.publishableKey, url, 'native');

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}
