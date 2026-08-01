import 'server-only';
import { createWebAdminClient } from '@/lib/supabase/admin';
import { requirePlatformAdmin } from '@/lib/auth/guards';

export interface CreateTenantParams {
  slug: string;
  legal_name: string;
  display_name: string;
  timezone?: string;
  locale?: string;
}

export interface UpdateBrandingParams {
  tenantId: string;
  logo_asset_path?: string | null;
  favicon_asset_path?: string | null;
  primary_color_h?: number;
  primary_color_s?: number;
  primary_color_l?: number;
  secondary_color_h?: number;
  secondary_color_s?: number;
  secondary_color_l?: number;
  accent_color_h?: number;
  accent_color_s?: number;
  accent_color_l?: number;
}

export interface CreateInvitationParams {
  tenantId: string;
  email: string;
  role?: string;
  expiresInHours?: number;
}

export class PlatformAdminService {
  private async getVerifiedActor() {
    const auth = await requirePlatformAdmin();
    if (!auth.authorized || !auth.user || !auth.email) {
      throw new Error(auth.message || '403 Forbidden: No autorizado para operaciones Platform Admin.');
    }
    return {
      actorUserId: auth.user.id,
      actorEmail: auth.email,
    };
  }

  async getAllTenants() {
    await this.getVerifiedActor();
    const admin = createWebAdminClient();
    const { data, error } = await admin
      .from('tenants')
      .select('*, tenant_branding(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTenantById(tenantId: string) {
    await this.getVerifiedActor();
    const admin = createWebAdminClient();
    const { data: tenant, error: tErr } = await admin.from('tenants').select('*').eq('id', tenantId).maybeSingle();

    if (tErr) throw tErr;
    if (!tenant) return null;

    const { data: branding } = await admin.from('tenant_branding').select('*').eq('tenant_id', tenantId).maybeSingle();

    const { data: invitations } = await admin
      .from('tenant_invitations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    const { data: memberships } = await admin.from('tenant_memberships').select('*').eq('tenant_id', tenantId);

    return {
      ...tenant,
      branding: branding || null,
      invitations: invitations || [],
      memberships: memberships || [],
    };
  }

  async createTenantWithDefaults(params: CreateTenantParams): Promise<string> {
    const { actorUserId, actorEmail } = await this.getVerifiedActor();
    const admin = createWebAdminClient();

    const { data, error } = await admin.rpc('create_tenant_with_defaults' as any, {
      p_actor_user_id: actorUserId,
      p_actor_email_snapshot: actorEmail,
      p_slug: params.slug.trim().toLowerCase(),
      p_legal_name: params.legal_name.trim(),
      p_display_name: params.display_name.trim(),
      p_timezone: params.timezone || 'America/Santiago',
      p_locale: params.locale || 'es-CL',
    });

    if (error) {
      throw new Error(`Error al crear empresa transportista: ${error.message}`);
    }

    return data as unknown as string;
  }

  async activateTenant(tenantId: string): Promise<boolean> {
    const { actorUserId, actorEmail } = await this.getVerifiedActor();
    const admin = createWebAdminClient();

    const { data, error } = await admin.rpc('activate_tenant' as any, {
      p_actor_user_id: actorUserId,
      p_actor_email_snapshot: actorEmail,
      p_tenant_id: tenantId,
    });

    if (error) {
      throw new Error(`Error al activar empresa: ${error.message}`);
    }

    return (data as unknown as boolean) || false;
  }

  async createTenantInvitation(params: CreateInvitationParams): Promise<string> {
    const { actorUserId, actorEmail } = await this.getVerifiedActor();
    const admin = createWebAdminClient();

    const { data, error } = await admin.rpc('create_tenant_invitation' as any, {
      p_actor_user_id: actorUserId,
      p_actor_email_snapshot: actorEmail,
      p_tenant_id: params.tenantId,
      p_email: params.email.trim().toLowerCase(),
      p_role: params.role || 'tenant_admin',
      p_expires_in_hours: params.expiresInHours || 72,
    });

    if (error) {
      throw new Error(`Error al crear invitación: ${error.message}`);
    }

    // Retorna el token plano una única vez
    return data as unknown as string;
  }

  async updateTenantBranding(params: UpdateBrandingParams): Promise<boolean> {
    const { actorUserId, actorEmail } = await this.getVerifiedActor();
    const admin = createWebAdminClient();

    const rpcArgs: Record<string, any> = {
      p_actor_user_id: actorUserId,
      p_actor_email_snapshot: actorEmail,
      p_tenant_id: params.tenantId,
    };

    if (params.logo_asset_path !== undefined) rpcArgs.p_logo_asset_path = params.logo_asset_path;
    if (params.favicon_asset_path !== undefined) rpcArgs.p_favicon_asset_path = params.favicon_asset_path;
    if (params.primary_color_h !== undefined) rpcArgs.p_primary_color_h = params.primary_color_h;
    if (params.primary_color_s !== undefined) rpcArgs.p_primary_color_s = params.primary_color_s;
    if (params.primary_color_l !== undefined) rpcArgs.p_primary_color_l = params.primary_color_l;
    if (params.secondary_color_h !== undefined) rpcArgs.p_secondary_color_h = params.secondary_color_h;
    if (params.secondary_color_s !== undefined) rpcArgs.p_secondary_color_s = params.secondary_color_s;
    if (params.secondary_color_l !== undefined) rpcArgs.p_secondary_color_l = params.secondary_color_l;
    if (params.accent_color_h !== undefined) rpcArgs.p_accent_color_h = params.accent_color_h;
    if (params.accent_color_s !== undefined) rpcArgs.p_accent_color_s = params.accent_color_s;
    if (params.accent_color_l !== undefined) rpcArgs.p_accent_color_l = params.accent_color_l;

    const { data, error } = await admin.rpc('update_tenant_branding' as any, rpcArgs);

    if (error) {
      throw new Error(`Error al actualizar branding: ${error.message}`);
    }

    return (data as unknown as boolean) || false;
  }
}

export const platformAdminService = new PlatformAdminService();
