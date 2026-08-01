import { createBrowserClient } from '@transport-platform/supabase/browser';

export function getWebSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_placeholder_local';

  return createBrowserClient({ url, publishableKey });
}
