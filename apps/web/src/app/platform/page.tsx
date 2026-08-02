import React from 'react';
import Link from 'next/link';
import { requirePlatformAdmin } from '@/lib/auth/guards';
import { platformAdminService } from '@/lib/services/platformAdminService';
import { ForbiddenView } from '@/components/ForbiddenView';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = {
  title: 'Platform SuperAdmin Portal | Transport Platform V2',
  description: 'Gestión global y administración de empresas transportistas del ecosistema.',
};

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <span
          style={{
            padding: '4px 10px',
            backgroundColor: '#DCFCE7',
            color: '#166534',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid #BBF7D0',
          }}
        >
          ● Activa (Active)
        </span>
      );
    case 'draft':
      return (
        <span
          style={{
            padding: '4px 10px',
            backgroundColor: '#FEF9C3',
            color: '#854D0E',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid #FEF08A',
          }}
        >
          ◐ Borrador (Draft)
        </span>
      );
    case 'suspended':
      return (
        <span
          style={{
            padding: '4px 10px',
            backgroundColor: '#FFEDD5',
            color: '#9A3412',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid #FED7AA',
          }}
        >
          ■ Suspendida
        </span>
      );
    case 'archived':
      return (
        <span
          style={{
            padding: '4px 10px',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid #CBD5E1',
          }}
        >
          ✕ Archivada
        </span>
      );
    default:
      return <span>{status}</span>;
  }
}

export default async function PlatformShellPage() {
  const auth = await requirePlatformAdmin();

  if (!auth.authorized) {
    return <ForbiddenView reason={auth.message} userEmail={auth.email || undefined} />;
  }

  const tenants = await platformAdminService.getAllTenants();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Corporativo Duet Solutions */}
      <header
        style={{
          backgroundColor: '#1C3B57',
          color: '#FFFFFF',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: '#E8832A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              color: '#FFF',
            }}
          >
            TP
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', color: '#FFFFFF' }}>
              Transport Platform V2
            </h1>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 500 }}>Consola del Platform SuperAdmin</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right', fontSize: '13px', color: '#E2E8F0' }}>
            <div>
              Conectado como: <strong>{auth.email}</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#88A947', fontWeight: 600 }}>● Sesión SuperAdmin Activa</div>
          </div>
          <LogoutButton variant="outline" />
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1C3B57', margin: 0 }}>Empresas Transportistas</h2>
            <p style={{ color: '#64748B', margin: '6px 0 0 0', fontSize: '15px' }}>
              Administre el alta, configuración de branding, invitaciones de operadores y activation del ecosistema.
            </p>
          </div>

          <Link
            href="/platform/tenants/new"
            style={{
              padding: '10px 20px',
              backgroundColor: '#E8832A',
              color: '#FFFFFF',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 2px rgba(232, 131, 42, 0.25)',
              transition: 'opacity 0.2s',
            }}
          >
            <span>+</span> Crear Empresa
          </Link>
        </div>

        {/* Listado de Tenants */}
        {tenants.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              padding: '64px 32px',
              textAlign: 'center',
              border: '1px dashed #CBD5E1',
              boxShadow: '0 1px 3px rgba(28, 59, 87, 0.05)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
            <h3 style={{ fontSize: '18px', color: '#1A2332', fontWeight: 600, margin: '0 0 8px 0' }}>
              No existen empresas transportistas registradas
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
              Comience el proceso de Onboarding de su primer cliente creando un tenant en estado borrador (draft).
            </p>
            <Link
              href="/platform/tenants/new"
              style={{
                padding: '10px 20px',
                backgroundColor: '#E8832A',
                color: '#FFF',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Iniciar Onboarding
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {tenants.map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0px 1px 3px rgba(28, 59, 87, 0.06), 0px 1px 2px rgba(28, 59, 87, 0.04)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {t.slug}
                    </span>
                    {getStatusBadge(t.status)}
                  </div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, color: '#1C3B57' }}>
                    {t.display_name}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                    Razón Social: {t.legal_name}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#64748B',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    Zona: <strong style={{ color: '#1C3B57' }}>{t.timezone}</strong>
                  </div>
                  <div>
                    Idioma: <strong style={{ color: '#1C3B57' }}>{t.locale}</strong>
                  </div>
                </div>

                <Link
                  href={`/platform/tenants/${t.id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px 16px',
                    backgroundColor: '#F8F9FA',
                    color: '#1C3B57',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Gestionar Empresa & Branding →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
