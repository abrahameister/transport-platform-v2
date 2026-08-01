import { createNativeClient } from '@transport-platform/supabase/native';

export function getDriverSupabaseClient() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_placeholder_local';

  return createNativeClient({ url, publishableKey });
}
