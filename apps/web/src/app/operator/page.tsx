import React from 'react';
import Link from 'next/link';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { getWebServerSupabaseClient } from '@/lib/supabase/server';
import { PageHeader } from '@transport-platform/ui-web';

export default async function OperatorDashboardPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant || !access.membership) return null;

  const { tenant } = access;
  const supabase = await getWebServerSupabaseClient();

  // Consultas de datos reales contra Supabase DEV
  const { count: memberCount } = await supabase
    .from('tenant_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id);

  const { count: inviteCount } = await supabase
    .from('tenant_invitations')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id)
    .eq('status', 'pending');

  const totalMembers = memberCount ?? 0;
  const pendingInvites = inviteCount ?? 0;

  return (
    <div>
      <PageHeader
        title="Resumen Operativo de Cuenta"
        subtitle={`Panel central de control y monitoreo de servicios para ${tenant.display_name}`}
      />

      {/* KPI Real Data Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.04)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Personal y Conductores
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#1C3B57', margin: '8px 0 4px 0' }}>
            {totalMembers}
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
            Usuarios operativos y chóferes registrados
          </div>
          <Link
            href="/operator/employees"
            style={{ fontSize: '13px', fontWeight: 700, color: '#E8832A', textDecoration: 'none', display: 'block' }}
          >
            Ver directorio de personal →
          </Link>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.04)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Invitaciones Pendientes
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#1C3B57', margin: '8px 0 4px 0' }}>
            {pendingInvites}
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
            Tokens activos pendientes de aceptación
          </div>
          <Link
            href="/operator/employees"
            style={{ fontSize: '13px', fontWeight: 700, color: '#E8832A', textDecoration: 'none', display: 'block' }}
          >
            Gestionar accesos →
          </Link>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.04)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Seguridad Multitenant RLS
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#88A947',
              margin: '14px 0 10px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓ 100% ACTIVO</span>
          </div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
            Aislamiento estricto de tablas por UUID de tenant garantizado en Postgres.
          </div>
        </div>
      </div>

      {/* Terminal Conductor Panel */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #CBD5E1',
          borderRadius: '10px',
          padding: '28px',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ flex: '1 1 500px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#2A4010',
              backgroundColor: '#E3FCEF',
              padding: '4px 10px',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}
          >
            ENTORNO NATIVO DE PRUEBAS EN VIVO
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1C3B57', margin: '12px 0 8px 0' }}>
            Terminal Móvil de Conductor (Expo / React Native)
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
            Entorno de prueba en vivo para validación de sesiones operativas de conductores rodantes. Conexión
            autenticada en tiempo real contra Supabase RLS sin flujos simulados ni dependencias externas.
          </p>
        </div>
        <div>
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#E8832A',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 2px 4px rgba(232, 131, 42, 0.2)',
            }}
          >
            Abrir Terminal Conductor (localhost:8081) ↗
          </a>
        </div>
      </div>

      {/* Matriz de Estado Real de Módulos Operacionales */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#1C3B57' }}>
            Estado Real de Componentes Operacionales (DEV Environment)
          </h3>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
            Declaración estricta de funcionalidades operables versus módulos deshabilitados según directivas de
            arquitectura.
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                backgroundColor: '#F8F9FA',
                borderBottom: '2px solid #E2E8F0',
                color: '#4A5568',
                fontWeight: 700,
              }}
            >
              <th style={{ padding: '12px 16px' }}>Componente / Módulo</th>
              <th style={{ padding: '12px 16px' }}>Ámbito y Descripción</th>
              <th style={{ padding: '12px 16px', width: '200px' }}>Estado Actual en DEV</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>
                Gestión de Personal & Conductores
              </td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Directorio corporativo, consulta de roles RLS y emisión de invitaciones operativas en vivo.
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    color: '#276749',
                    fontWeight: 700,
                    backgroundColor: '#E3FCEF',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  🟢 ACTIVO EN DEV
                </span>
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>Aislamiento Multitenant & RLS</td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Enforcement fail-closed a nivel de motor PostgreSQL para todas las consultas y acciones.
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    color: '#276749',
                    fontWeight: 700,
                    backgroundColor: '#E3FCEF',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  🟢 ACTIVO EN DEV
                </span>
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>Terminal de Conductor Nativo</td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Autenticación de choferes, validación de identidad y verificación de conectividad de sesión.
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    color: '#276749',
                    fontWeight: 700,
                    backgroundColor: '#E3FCEF',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  🟢 ACTIVO EN DEV
                </span>
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>Importación Masiva por Lote</td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Procesamiento de plantillas (.csv / .xlsx) para carga masiva de personal y nómina.
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    color: '#854D0E',
                    fontWeight: 700,
                    backgroundColor: '#FEF9C3',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  ⚪ EN PROCESO REAL
                </span>
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>Directorio de Cuentas Cliente</td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Vinculación comercial para centros de costo externos y portal de autoservicio.
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    color: '#475569',
                    fontWeight: 700,
                    backgroundColor: '#F1F5F9',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: '1px solid #CBD5E1',
                  }}
                >
                  ⚪ DESHABILITADO
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>Motor de Despachos y Demanda</td>
              <td style={{ padding: '14px 16px', color: '#475569' }}>
                Asignación algorítmica de servicios, monitoreo de capacidad y hojas de ruta en vivo.
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    color: '#475569',
                    fontWeight: 700,
                    backgroundColor: '#F1F5F9',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: '1px solid #CBD5E1',
                  }}
                >
                  ⚪ DESHABILITADO
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
