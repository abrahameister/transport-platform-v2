import React from 'react';
import { Tabs } from 'expo-router';
import { useNativeTheme, useNativeBrand } from '@transport-platform/ui-native';

export default function TabLayout() {
  const { tokens } = useNativeTheme();
  const brand = useNativeBrand();
  const brandColor = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: brandColor },
        headerTintColor: tokens.text.onPrimary,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: brandColor,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
