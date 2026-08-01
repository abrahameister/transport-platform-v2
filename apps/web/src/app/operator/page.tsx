import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { ForbiddenView } from '@/components/ForbiddenView';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = {
  title: 'Portal Operativo | Transport Platform V2',
  description: 'Shell del Administrador Operativo y gestión de flota en Transport Platform V2.',
};

export default async function OperatorShellPage() {
  const access = await requireOperatorAccess();

  if (!access.authorized || !access.tenant || !access.membership) {
    return <ForbiddenView reason={access.reason} userEmail={access.user?.email || undefined} />;
  }

  const { tenant, user, membership, branding } = access;

  // Extraer color HSL para una estética dinámica y WOW basada en el branding del tenant
  const primaryColor = `hsl(${branding.primary_color_h ?? 210}, ${branding.primary_color_s ?? 80}%, ${branding.primary_color_l ?? 45}%)`;
  const secondaryColor = `hsl(${branding.secondary_color_h ?? 180}, ${branding.secondary_color_s ?? 70}%, ${branding.secondary_color_l ?? 40}%)`;

  const upcomingModules = [
    {
      title: 'Gestión de Transporte & Despachos',
      icon: '🚍',
      desc: 'Asignación en tiempo real, despachos de servicios y contingencias operativas.',
    },
    {
      title: 'Funcionarios & Personal',
      icon: '👥',
      desc: 'Directorio laboral, turnos de trabajo y asignación de beneficios de transporte.',
    },
    {
      title: 'Rutas & Paraderos PostGIS',
      icon: '🗺️',
      desc: 'Geolocalización, trazados espaciales, zonas de exclusión y optimización.',
    },
    {
      title: 'Flota & Vehículos',
      icon: '🚐',
      desc: 'Control de mantenimientos, revisión técnica, patentes y asignación de conductores.',
    },
    {
      title: 'Planificación de Servicios',
      icon: '📅',
      desc: 'Programación semanal, agendas recurrente y predicción de demanda operacional.',
    },
    {
      title: 'Tracking GPS & Telemetría',
      icon: '📡',
      desc: 'Monitoreo en vivo de unidades rodantes con WebSockets y PostGIS streaming.',
    },
    {
      title: 'Tarifas & Facturaciones',
      icon: '💳',
      desc: 'Cálculo de costos, contratos comerciales con clientes y facturación automática.',
    },
    {
      title: 'App Conductor (Expo / Native)',
      icon: '📱',
      desc: 'Terminal móvil de abordo para choferes, lectura QR y confirmación de rutas.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Personalizado con Branding HSL del Tenant */}
      <header
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          color: '#FFFFFF',
          padding: '20px 36px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '22px',
              letterSpacing: '-0.5px',
            }}
          >
            {tenant.slug.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.4px' }}>
                {tenant.display_name}
              </h1>
              <span
                style={{
                  padding: '2px 10px',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                ● {tenant.status}
              </span>
            </div>
            <span style={{ fontSize: '13px', opacity: 0.9, fontWeight: 500 }}>
              {tenant.legal_name} | Portal Operativo Transport Platform V2
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{user.email}</div>
            <div
              style={{
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.25)',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                marginTop: '4px',
              }}
            >
              Rol: <strong>{membership.role.toUpperCase()}</strong>
            </div>
          </div>
          <LogoutButton variant="outline" />
        </div>
      </header>

      {/* Barra de Estado del Tenant */}
      <div
        style={{
          backgroundColor: '#1E293B',
          color: '#CBD5E1',
          padding: '10px 36px',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span>
            🌐 Zona Horaria: <strong>{tenant.timezone}</strong>
          </span>
          <span style={{ margin: '0 12px' }}>|</span>
          <span>
            📍 Idioma: <strong>{tenant.locale}</strong>
          </span>
          <span style={{ margin: '0 12px' }}>|</span>
          <span>
            🔒 Aislamiento: <strong>Postgres RLS Active</strong>
          </span>
        </div>
        <div style={{ color: '#10B981', fontWeight: 600 }}>⚡ Conexión Segura en Tiempo Real con Supabase DEV</div>
      </div>

      {/* Canvas Operativo */}
      <main style={{ maxWidth: '1300px', margin: '40px auto', padding: '0 36px' }}>
        <div
          style={{
            marginBottom: '32px',
            backgroundColor: '#FFFFFF',
            padding: '24px 28px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
            Bienvenido al Centro de Mando Operativo de {tenant.display_name}
          </h2>
          <p style={{ color: '#64748B', margin: 0, fontSize: '15px' }}>
            Usted está conectado como <strong>Tenant Admin</strong> con permisos de gestión para la empresa activa. A
            continuación se presentan los módulos especializados en transporte que formarán parte del ecosistema y se
            habilitarán en los próximos Sprints.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {upcomingModules.map((mod, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ fontSize: '36px', marginBottom: '14px', filter: 'grayscale(0.2)' }}>{mod.icon}</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>
                  {mod.title}
                </h3>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', lineHeight: '1.5', minHeight: '42px' }}>
                  {mod.desc}
                </p>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#94A3B8',
                    backgroundColor: '#F8FAFC',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  🚧 Sprint 2+
                </span>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Bloqueado en Bloque 1</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
