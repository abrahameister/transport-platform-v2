'use server';

import { platformAdminService } from '@/lib/services/platformAdminService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTenantAction(_prevState: any, formData: FormData) {
  const slug = (formData.get('slug') as string)?.trim();
  const legal_name = (formData.get('legal_name') as string)?.trim();
  const display_name = (formData.get('display_name') as string)?.trim();
  const timezone = (formData.get('timezone') as string)?.trim() || 'America/Santiago';
  const locale = (formData.get('locale') as string)?.trim() || 'es-CL';

  if (!slug || !legal_name || !display_name) {
    return { error: 'Los campos Slug, Razón Social y Nombre Visible son obligatorios.' };
  }

  try {
    const tenantId = await platformAdminService.createTenantWithDefaults({
      slug,
      legal_name,
      display_name,
      timezone,
      locale,
    });
    revalidatePath('/platform');
    revalidatePath('/platform/tenants');
    redirect(`/platform/tenants/${tenantId}`);
  } catch (error: any) {
    // Si se invoca redirect, Next lo maneja tirando una excepción NEXT_REDIRECT, no debemos atraparla como error de UI
    if (error.message && error.message.includes('NEXT_REDIRECT')) throw error;
    if (error.digest && error.digest.includes('NEXT_REDIRECT')) throw error;
    return { error: error.message || 'Error al crear la empresa transportista.' };
  }
}

export async function activateTenantAction(tenantId: string) {
  try {
    await platformAdminService.activateTenant(tenantId);
    revalidatePath(`/platform/tenants/${tenantId}`);
    revalidatePath('/platform');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Error al activar la empresa.' };
  }
}

export async function createInvitationAction(_prevState: any, formData: FormData) {
  const tenantId = (formData.get('tenant_id') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();

  if (!tenantId || !email) {
    return { error: 'Debe especificar el identificador de empresa y un correo válido.' };
  }

  try {
    const token = await platformAdminService.createTenantInvitation({
      tenantId,
      email,
    });
    revalidatePath(`/platform/tenants/${tenantId}`);
    return { success: true, token, invitedEmail: email };
  } catch (error: any) {
    return { error: error.message || 'No se pudo generar la invitación.' };
  }
}

export async function updateBrandingAction(_prevState: any, formData: FormData) {
  const tenantId = (formData.get('tenant_id') as string)?.trim();
  if (!tenantId) return { error: 'Identificador de empresa faltante.' };

  const primary_color_h = parseInt((formData.get('primary_color_h') as string) || '210', 10);
  const primary_color_s = parseInt((formData.get('primary_color_s') as string) || '80', 10);
  const primary_color_l = parseInt((formData.get('primary_color_l') as string) || '50', 10);
  const secondary_color_h = parseInt((formData.get('secondary_color_h') as string) || '180', 10);
  const secondary_color_s = parseInt((formData.get('secondary_color_s') as string) || '70', 10);
  const secondary_color_l = parseInt((formData.get('secondary_color_l') as string) || '40', 10);
  const logo_asset_path = (formData.get('logo_asset_path') as string)?.trim() || '/assets/logo-placeholder.svg';

  try {
    await platformAdminService.updateTenantBranding({
      tenantId,
      logo_asset_path,
      primary_color_h,
      primary_color_s,
      primary_color_l,
      secondary_color_h,
      secondary_color_s,
      secondary_color_l,
    });
    revalidatePath(`/platform/tenants/${tenantId}`);
    revalidatePath('/operator');
    return { success: true, message: 'Configuración de branding actualizada con éxito.' };
  } catch (error: any) {
    return { error: error.message || 'No fue posible actualizar el branding.' };
  }
}
