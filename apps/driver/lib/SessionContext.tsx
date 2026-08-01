/**
 * SessionContext — Expo Driver App
 * Provides authentication state and session management.
 * Uses Supabase onAuthStateChange for reactive session restore.
 *
 * Never exposes access token or refresh token directly to UI.
 * Never uses service role or admin API.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getDriverSupabaseClient } from './supabase';

interface TenantInfo {
  id: string;
  slug: string;
  display_name: string;
  legal_name: string;
  status: string;
  timezone: string;
  locale: string;
}

interface MembershipInfo {
  tenant_id: string;
  user_id: string;
  role: string;
  status: string;
}

interface BrandingInfo {
  tenant_id: string;
  primary_color_h: number | null;
  primary_color_s: number | null;
  primary_color_l: number | null;
  secondary_color_h: number | null;
  secondary_color_s: number | null;
  secondary_color_l: number | null;
}

interface SessionContextValue {
  session: Session | null;
  user: User | null;
  tenant: TenantInfo | null;
  membership: MembershipInfo | null;
  branding: BrandingInfo | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [branding, setBranding] = useState<BrandingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getDriverSupabaseClient();

  async function loadTenantData(userId: string) {
    try {
      // Fetch active membership for this user
      const { data: mem, error: memErr } = await supabase
        .from('tenant_memberships')
        .select('tenant_id, user_id, role, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (memErr || !mem) {
        setTenant(null);
        setMembership(null);
        setBranding(null);
        return;
      }

      setMembership(mem as MembershipInfo);

      // Fetch the tenant
      const { data: t, error: tErr } = await supabase
        .from('tenants')
        .select('id, slug, display_name, legal_name, status, timezone, locale')
        .eq('id', mem.tenant_id)
        .eq('status', 'active')
        .maybeSingle();

      if (tErr || !t) {
        setTenant(null);
        return;
      }

      setTenant(t as TenantInfo);

      // Fetch branding
      const { data: b } = await supabase
        .from('tenant_branding')
        .select(
          'tenant_id, primary_color_h, primary_color_s, primary_color_l, secondary_color_h, secondary_color_s, secondary_color_l'
        )
        .eq('tenant_id', mem.tenant_id)
        .maybeSingle();

      setBranding(b as BrandingInfo | null);
    } catch (e) {
      console.error('[SessionContext] Error loading tenant data:', e);
    }
  }

  useEffect(() => {
    // Initial session fetch from SecureStore
    supabase.auth
      .getSession()
      .then(({ data: { session: s } }: { data: { session: import('@supabase/supabase-js').Session | null } }) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          loadTenantData(s.user.id).finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });

    // Subscribe to auth state changes for reactive session restore & logout
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: string, s: import('@supabase/supabase-js').Session | null) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          setLoading(true);
          loadTenantData(s.user.id).finally(() => setLoading(false));
        } else {
          setTenant(null);
          setMembership(null);
          setBranding(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      const msg = 'Credenciales incorrectas. Verifique su correo y contraseña.';
      setError(msg);
      return { error: msg };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setTenant(null);
    setMembership(null);
    setBranding(null);
    setError(null);
  };

  return (
    <SessionContext.Provider value={{ session, user, tenant, membership, branding, loading, error, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
