import { createClient as createSupabaseClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { validateSupabaseUrl, validatePublishableKey } from './validation';

export interface SupabaseNativeConfig {
  url: string;
  publishableKey: string;
  /** Optional overrides for auth and other Supabase client options */
  options?: Pick<SupabaseClientOptions<'public'>, 'auth' | 'global' | 'realtime'>;
}

export function createNativeClient(config: SupabaseNativeConfig): SupabaseClient {
  const url = validateSupabaseUrl(config?.url);
  const key = validatePublishableKey(config?.publishableKey, url, 'native');

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      // Allow caller to override storage and other auth options
      ...config.options?.auth,
    },
    ...(config.options?.global ? { global: config.options.global } : {}),
    ...(config.options?.realtime ? { realtime: config.options.realtime } : {}),
  });
}
