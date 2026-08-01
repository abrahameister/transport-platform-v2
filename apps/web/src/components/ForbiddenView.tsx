'use client';

import React, { useTransition } from 'react';
import { Button, ContentContainer, PageHeader, Alert } from '@transport-platform/ui-web';
import { signOutAction } from '@/lib/actions/authActions';

interface ForbiddenViewProps {
  reason?: string;
  userEmail?: string;
}

export const ForbiddenView: React.FC<ForbiddenViewProps> = ({
  reason = 'Su cuenta no dispone de los permisos necesarios para acceder a esta sección.',
  userEmail,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        background: 'radial-gradient(circle at top right, #1E293B, #0F172A)',
        padding: '24px',
      }}
    >
      <ContentContainer className="forbidden-card">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span role="img" aria-label="Restringido" style={{ fontSize: '48px' }}>
            🛡️
          </span>
        </div>
        <PageHeader title="403 — Acceso Denegado" subtitle="Transport Platform V2 Security Spine" />
        <Alert variant="warning" title="Privilege Boundary Restringido" style={{ margin: '16px 0' }}>
          {reason}
        </Alert>
        {userEmail && (
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
            Autenticado actualmente con: <strong>{userEmail}</strong>
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button
            variant="primary"
            onClick={handleSignOut}
            disabled={isPending}
            style={{ backgroundColor: '#EF4444', borderColor: '#DC2626', color: '#FFF' }}
          >
            {isPending ? 'Cerrando sesión...' : 'Cerrar Sesión y Cambiar de Cuenta'}
          </Button>
        </div>
      </ContentContainer>
    </div>
  );
};
