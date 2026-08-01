/**
 * Operator shell home screen for Expo Driver app.
 *
 * Shows:
 * - Active tenant name and status
 * - User info and role
 * - Dynamic branding from tenant_branding
 * - Session status
 * - Placeholders for future Sprint 2+ modules
 * - Logout
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSession } from '../../lib/SessionContext';
import { router } from 'expo-router';

const UPCOMING_MODULES = [
  { icon: '🚍', title: 'Despachos', desc: 'Servicios asignados para hoy' },
  { icon: '🗺️', title: 'Rutas', desc: 'Trazados y paraderos PostGIS' },
  { icon: '📅', title: 'Agenda', desc: 'Turnos y programación semanal' },
  { icon: '📡', title: 'Tracking GPS', desc: 'Posición en tiempo real' },
  { icon: '👥', title: 'Funcionarios', desc: 'Directorio y contactos' },
  { icon: '🚐', title: 'Flota', desc: 'Mi vehículo y mantenimiento' },
];

export default function OperatorHomeScreen() {
  const { user, tenant, membership, branding, signOut } = useSession();

  const primaryH = branding?.primary_color_h ?? 217;
  const primaryS = branding?.primary_color_s ?? 91;
  const primaryL = branding?.primary_color_l ?? 60;
  const primaryColor = `hsl(${primaryH}, ${primaryS}%, ${primaryL}%)`;

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  if (!tenant || !user || !membership) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header con branding dinámico */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>{tenant.slug.substring(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.tenantName}>{tenant.display_name}</Text>
            <Text style={styles.tenantSub}>{tenant.legal_name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
            <Text style={styles.statusText}>● {tenant.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userRole}>Rol: {membership.role.toUpperCase()}</Text>
        </View>

        <View style={styles.sessionBadge}>
          <Text style={styles.sessionText}>🔒 Sesión segura activa · RLS enforced</Text>
        </View>
      </View>

      {/* Info de empresa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Empresa</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Zona horaria</Text>
          <Text style={styles.infoValue}>{tenant.timezone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Idioma</Text>
          <Text style={styles.infoValue}>{tenant.locale}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rol operativo</Text>
          <Text style={styles.infoValue}>{membership.role}</Text>
        </View>
      </View>

      {/* Módulos futuros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Módulos Operativos</Text>
        <Text style={styles.sectionSubtitle}>Sprint 2+ — Próximamente disponibles</Text>
        <View style={styles.moduleGrid}>
          {UPCOMING_MODULES.map((mod) => (
            <View key={mod.title} style={styles.moduleCard} accessibilityRole="button" accessibilityLabel={mod.title}>
              <Text style={styles.moduleIcon}>{mod.icon}</Text>
              <Text style={styles.moduleTitle}>{mod.title}</Text>
              <Text style={styles.moduleDesc}>{mod.desc}</Text>
              <View style={styles.moduleBadge}>
                <Text style={styles.moduleBadgeText}>🚧 Sprint 2+</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión"
      >
        <Text style={styles.signOutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 56,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  tenantName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  tenantSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  userInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
    marginBottom: 12,
  },
  userEmail: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  userRole: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  sessionBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sessionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  section: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moduleIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  moduleDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  moduleBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moduleBadgeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  signOutButton: {
    margin: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  signOutText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },
});
