'use server';

import { getWebServerSupabaseClient } from '@/lib/supabase/server';
import { checkIsPlatformSuperAdmin } from '@/lib/auth/guards';
import { redirect } from 'next/navigation';

export async function signInAction(_prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const redirectUrl = (formData.get('redirect') as string) || null;

  if (!email || !password) {
    return { error: 'Por favor, introduzca su correo electrónico y contraseña.' };
  }

  const supabase = await getWebServerSupabaseClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login') || error.status === 400) {
      return { error: 'Credenciales inválidas. Compruebe el correo y la contraseña.' };
    }
    return { error: `Error al iniciar sesión: ${error.message}` };
  }

  const userEmail = data.user?.email || '';
  const isSuperAdmin = checkIsPlatformSuperAdmin(userEmail);

  if (redirectUrl && redirectUrl.startsWith('/')) {
    redirect(redirectUrl);
  }

  if (isSuperAdmin) {
    redirect('/platform');
  } else {
    redirect('/operator');
  }
}

export async function signOutAction() {
  const supabase = await getWebServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}

export async function acceptInvitationAction(token: string) {
  const supabase = await getWebServerSupabaseClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return { error: 'Debe estar autenticado para aceptar una invitación.' };
  }

  const { error } = await supabase.rpc('accept_tenant_invitation', {
    p_token: token,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes('email') &&
      (msg.includes('match') || msg.includes('does not match') || msg.includes('no coincide'))
    ) {
      return {
        error: 'El correo electrónico de su sesión actual no coincide con la dirección del destinatario invitado.',
      };
    }
    if (msg.includes('confirm') || msg.includes('unverified') || msg.includes('not verified')) {
      return { error: 'Su dirección de correo electrónico no ha sido confirmada todavía.' };
    }
    if (msg.includes('expir') || msg.includes('expired') || msg.includes('vencida')) {
      return {
        error:
          'Esta invitación ha vencido. Solicite al Administrador de la Plataforma que reenvíe una nueva invitación.',
      };
    }
    if (msg.includes('revok') || msg.includes('revocada')) {
      return { error: 'Esta invitación ha sido revocada por un administrador.' };
    }
    if (msg.includes('already') || msg.includes('used') || msg.includes('utilizada') || msg.includes('accepted')) {
      return { error: 'Esta invitación ya ha sido utilizada con anterioridad.' };
    }
    return { error: `No fue posible aceptar la invitación: ${error.message}` };
  }

  redirect('/operator');
}
