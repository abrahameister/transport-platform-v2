import React from 'react';
import { Stack } from 'expo-router';
import { NativeThemeProvider } from '@transport-platform/ui-native';

export default function RootLayout() {
  return (
    <NativeThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </NativeThemeProvider>
  );
}
