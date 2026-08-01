/**
 * Operator route group layout.
 * Protected — redirects to sign-in if no session.
 * Also validates tenant status and membership before rendering.
 */

import React from 'react';
import { Stack, router } from 'expo-router';
import { useSession } from '../../lib/SessionContext';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function OperatorLayout() {
  const { session, loading, tenant, membership } = useSession();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Verificando sesión...</Text>
      </View>
    );
  }

  if (!session) {
    router.replace('/(auth)/sign-in');
    return null;
  }

  if (!tenant || !membership) {
    return (
      <View style={styles.center}>
        <Text style={styles.icon}>🏢</Text>
        <Text style={styles.title}>Sin Empresa Asignada</Text>
        <Text style={styles.desc}>
          Su cuenta no está asociada a ninguna empresa activa en Transport Platform. Contacte al administrador de su
          empresa para recibir una invitación.
        </Text>
      </View>
    );
  }

  if (tenant.status === 'suspended') {
    return (
      <View style={styles.center}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Empresa Suspendida</Text>
        <Text style={styles.desc}>
          La empresa «{tenant.display_name}» está suspendida. Contacte al administrador de la plataforma.
        </Text>
      </View>
    );
  }

  if (membership.status !== 'active') {
    return (
      <View style={styles.center}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>Membresía Inactiva</Text>
        <Text style={styles.desc}>
          Su membresía en «{tenant.display_name}» no está activa. Contacte al administrador de la empresa.
        </Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
  },
  icon: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
});
