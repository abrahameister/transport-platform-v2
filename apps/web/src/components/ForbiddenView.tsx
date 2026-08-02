'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
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

  const isUnauthenticated =
    !userEmail || reason.toLowerCase().includes('iniciar sesión') || reason.toLowerCase().includes('no autenticado');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        padding: '24px',
      }}
    >
      <ContentContainer className="forbidden-card">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span role="img" aria-label="Restringido" style={{ fontSize: '48px' }}>
            {isUnauthenticated ? '🔒' : '🛡️'}
          </span>
        </div>
        <PageHeader
          title={isUnauthenticated ? '401 — Autenticación Requerida' : '403 — Acceso Denegado'}
          subtitle="Transport Platform V2 Security Spine"
        />
        <Alert variant={isUnauthenticated ? 'info' : 'warning'} title="Estado de Acceso" style={{ margin: '16px 0' }}>
          {reason}
        </Alert>
        {userEmail ? (
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
            Autenticado actualmente con: <strong>{userEmail}</strong>
          </p>
        ) : (
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
            Actualmente no hay una sesión operativa activa en este navegador.
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="secondary"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', color: '#1C3B57' }}
            >
              Volver al Inicio
            </Button>
          </Link>
          {userEmail ? (
            <Button
              variant="primary"
              onClick={handleSignOut}
              disabled={isPending}
              style={{ backgroundColor: '#EF4444', borderColor: '#DC2626', color: '#FFF' }}
            >
              {isPending ? 'Cerrando sesión...' : 'Cerrar Sesión y Cambiar de Cuenta'}
            </Button>
          ) : (
            <Link href="/sign-in" style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                style={{ backgroundColor: '#E8832A', borderColor: '#D97720', color: '#FFFFFF', fontWeight: 600 }}
              >
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </ContentContainer>
    </div>
  );
};
