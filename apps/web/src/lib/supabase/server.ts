import { createServerClient } from '@transport-platform/supabase/server';

export function getWebServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_placeholder_local';

  return createServerClient({ url, publishableKey });
}
