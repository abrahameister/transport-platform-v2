import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { ForbiddenView } from '@/components/ForbiddenView';
import { LogoutButton } from '@/components/LogoutButton';
import { OperatorNav } from './OperatorNav';

export const metadata = {
  title: 'Consola de Operaciones B2B | Transport Platform V2',
  description: 'Gestión corporativa de personal, conductores y servicios de transporte en tiempo real.',
};

export default async function OperatorLayout({ children }: { children: React.ReactNode }) {
  const access = await requireOperatorAccess();

  if (!access.authorized || !access.tenant || !access.membership) {
    return <ForbiddenView reason={access.reason} userEmail={access.user?.email || undefined} />;
  }

  const { tenant, user, membership } = access;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Corporativo Duet Solutions */}
      <header
        style={{
          backgroundColor: '#1C3B57',
          color: '#FFFFFF',
          padding: '16px 36px',
          boxShadow: '0 2px 6px rgba(28, 59, 87, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              backgroundColor: '#E8832A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              color: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            {tenant.slug.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px', color: '#FFFFFF' }}>
                {tenant.display_name}
              </h1>
              <span
                style={{
                  padding: '2px 10px',
                  backgroundColor: '#88A947',
                  color: '#FFFFFF',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                ● {tenant.status.toUpperCase()}
              </span>
            </div>
            <span style={{ fontSize: '13px', color: '#CBD5E1', fontWeight: 500 }}>
              {tenant.legal_name} | Consola Operativa B2B
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{user.email}</div>
            <div
              style={{
                fontSize: '11px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                marginTop: '3px',
                fontWeight: 600,
              }}
            >
              ROL: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{membership.role.toUpperCase()}</span>
            </div>
          </div>
          <LogoutButton variant="outline" />
        </div>
      </header>

      {/* Barra de Estado Regional y de Aislamiento de Datos */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 36px',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#4A5568',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>
            Zona Horaria: <strong style={{ color: '#1C3B57' }}>{tenant.timezone}</strong>
          </span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span>
            Idioma y Región: <strong style={{ color: '#1C3B57' }}>{tenant.locale}</strong>
          </span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span>
            Seguridad y Aislamiento: <strong style={{ color: '#1C3B57' }}>Postgres RLS Enforced</strong>
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#2A4010',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#88A947',
            }}
          ></span>
          Conectado a Servidor Supabase DEV
        </div>
      </div>

      {/* Navegación por Pestañas del Operador */}
      <OperatorNav />

      {/* Área Principal */}
      <main style={{ maxWidth: '1360px', margin: '32px auto', padding: '0 36px', paddingBottom: '64px' }}>
        {children}
      </main>
    </div>
  );
}
