/**
 * Supabase native client for Expo Driver app.
 * Uses @transport-platform/supabase/native which wraps createClient
 * with the correct config for React Native.
 *
 * CRITICAL RULES:
 * - Never use service role server keys here (server-only)
 * - Never import supabase admin package here
 * - Only use public API and authorized RPCs
 * - Never log access tokens or refresh tokens
 */

import { createNativeClient } from '@transport-platform/supabase/native';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

let _client: ReturnType<typeof createNativeClient> | null = null;

export function getDriverSupabaseClient() {
  if (_client) return _client;

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    // In dev builds, warn but don't crash; placeholders allow type checking
    console.warn('[Driver] Supabase env vars not set — using placeholder values');
  }

  _client = createNativeClient({
    url: url || 'http://127.0.0.1:54321',
    publishableKey: publishableKey || 'sb_publishable_placeholder_local',
    options: {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    },
  });

  return _client;
}
