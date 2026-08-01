/**
 * Root layout for Expo Driver App.
 * Wraps all routes with SessionProvider for auth state management.
 * Protected navigation handled via useSession in each screen.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { NativeThemeProvider } from '@transport-platform/ui-native';
import { SessionProvider } from '../lib/SessionContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <NativeThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(operator)" options={{ headerShown: false }} />
        </Stack>
      </NativeThemeProvider>
    </SessionProvider>
  );
}
