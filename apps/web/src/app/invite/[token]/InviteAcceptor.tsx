'use client';

import React, { useState, useTransition } from 'react';
import { ContentContainer, Alert, PageHeader, Button } from '@transport-platform/ui-web';
import { acceptInvitationAction } from '@/lib/actions/authActions';
import { LogoutButton } from '@/components/LogoutButton';

interface InviteAcceptorProps {
  token: string;
  userEmail: string;
}

export function InviteAcceptor({ token, userEmail }: InviteAcceptorProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await acceptInvitationAction(token);
        if (res?.error) {
          setError(res.error);
        }
      } catch (err: any) {
        if (err.message && err.message.includes('NEXT_REDIRECT')) throw err;
        if (err.digest && err.digest.includes('NEXT_REDIRECT')) throw err;
        setError(err.message || 'Ocurrió un error inesperado al aceptar la invitación.');
      }
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        padding: '20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <ContentContainer>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📩</div>
            <PageHeader title="Invitación Operativa" subtitle="Transport Platform V2 - Tenant Admin" />

            {error && (
              <Alert
                variant="danger"
                title="No fue posible aceptar la invitación"
                style={{
                  marginBottom: '24px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #F87171',
                  color: '#991B1B',
                  textAlign: 'left',
                  padding: '16px',
                }}
              >
                {error}
              </Alert>
            )}

            <Alert variant="info" title="Confirmación de Identidad" style={{ marginBottom: '24px', textAlign: 'left' }}>
              Se encuentra autenticado actualmente en el navegador con la cuenta: <strong>{userEmail}</strong>
            </Alert>

            <p
              style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', textAlign: 'left' }}
            >
              Al confirmar, su usuario será asociado de forma segura con el rol de{' '}
              <strong>Administrador Operativo (Tenant Admin)</strong> a la empresa transportista correspondiente al
              token criptográfico recibido.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                type="button"
                variant="primary"
                disabled={isPending}
                onClick={handleAccept}
                style={{
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: 600,
                  width: '100%',
                }}
              >
                {isPending
                  ? 'Aceptando invitación y uniendo al Tenant...'
                  : '✓ Aceptar Invitación e Ingresar a Operador'}
              </Button>

              <div
                style={{
                  marginTop: '16px',
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#64748B' }}>¿No es su cuenta operativa?</span>
                <LogoutButton variant="outline" />
              </div>
            </div>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}
