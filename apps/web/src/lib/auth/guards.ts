import 'server-only';
import { getWebServerSupabaseClient } from '@/lib/supabase/server';

export function checkIsPlatformSuperAdmin(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalizedEmail = email.trim().toLowerCase();

  const allowlistEnv = process.env.PLATFORM_SUPERADMIN_EMAILS || '';
  const allowedEmails = allowlistEnv
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(normalizedEmail);
}

export async function requirePlatformAdmin() {
  const supabase = await getWebServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authorized: false as const,
      status: 401 as const,
      message: 'Usuario no autenticado. Debe iniciar sesión.',
      user: null,
      email: '',
    };
  }

  const email = user.email ? user.email.trim().toLowerCase() : '';
  const isAllowed = checkIsPlatformSuperAdmin(email);

  if (!isAllowed) {
    return {
      authorized: false as const,
      status: 403 as const,
      message: '403 Forbidden: Acceso restringido exclusivamente para Platform SuperAdmins.',
      user,
      email,
    };
  }

  return { authorized: true as const, status: 200 as const, user, email };
}

export async function requireOperatorAccess() {
  const supabase = await getWebServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false as const,
      status: 401 as const,
      reason: 'Debe iniciar sesión para ingresar al portal operativo.',
      user: null,
    };
  }

  // 1. Verificar estado del perfil
  const { data: profile } = await supabase.from('profiles').select('id, email, status').eq('id', user.id).single();

  if (profile && profile.status === 'suspended') {
    return {
      authorized: false as const,
      status: 403 as const,
      reason: 'Acceso denegado: El perfil de usuario se encuentra suspendido.',
      user,
    };
  }

  // 2. Obtener tenant activo
  const { data: context } = await supabase
    .from('user_tenant_context')
    .select('active_tenant_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let activeTenantId = context?.active_tenant_id;

  // Si no hay contexto explícito, intentamos buscar si tiene una membresía activa y asignarlo
  if (!activeTenantId) {
    const { data: mem } = await supabase
      .from('tenant_memberships')
      .select('tenant_id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (mem && mem.tenant_id) {
      activeTenantId = mem.tenant_id;
      await supabase.rpc('set_active_tenant', { p_tenant_id: activeTenantId });
    } else {
      return {
        authorized: false as const,
        status: 403 as const,
        reason: 'Acceso denegado: No cuenta con una empresa (tenant) activa ni membresías operativas asignadas.',
        user,
      };
    }
  }

  // 3. Verificar membresía
  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('id, role, status')
    .eq('user_id', user.id)
    .eq('tenant_id', activeTenantId)
    .maybeSingle();

  if (!membership || membership.status === 'revoked') {
    return {
      authorized: false as const,
      status: 403 as const,
      reason: 'Acceso denegado: Su membresía en esta empresa ha sido revocada o es inexistente.',
      user,
    };
  }

  // 4. Verificar estado del tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, slug, legal_name, display_name, status, timezone, locale')
    .eq('id', activeTenantId)
    .maybeSingle();

  if (!tenant || tenant.status !== 'active') {
    return {
      authorized: false as const,
      status: 403 as const,
      reason: `Acceso denegado: La empresa "${tenant?.display_name || activeTenantId}" no se encuentra activa (estado actual: ${tenant?.status || 'desconocido'}).`,
      user,
    };
  }

  // 5. Obtener branding del tenant
  const { data: branding } = await supabase
    .from('tenant_branding')
    .select('*')
    .eq('tenant_id', activeTenantId)
    .maybeSingle();

  return {
    authorized: true as const,
    status: 200 as const,
    user,
    profile,
    membership,
    tenant,
    branding: branding || {
      primary_color_h: 210,
      primary_color_s: 80,
      primary_color_l: 50,
      secondary_color_h: 180,
      secondary_color_s: 70,
      secondary_color_l: 40,
    },
  };
}
