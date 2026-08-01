import React from 'react';
import { getWebServerSupabaseClient } from '@/lib/supabase/server';
import { InviteAcceptor } from './InviteAcceptor';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Aceptar Invitación | Transport Platform V2',
  description: 'Portal de vinculación de usuarios y operadores a empresas transportistas.',
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InviteTokenPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await getWebServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Redirigir de forma explícita por si el middleware falló o en navegación directa
    redirect(`/sign-in?redirect=/invite/${encodeURIComponent(token)}`);
  }

  return <InviteAcceptor token={token} userEmail={user.email || 'Anónimo'} />;
}
