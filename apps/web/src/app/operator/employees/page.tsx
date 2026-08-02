import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { getWebServerSupabaseClient } from '@/lib/supabase/server';
import { PageHeader, Alert } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Personal y Conductores | Consola Operador',
  description: 'Directorio de miembros y conductores registrados en el tenant.',
};

export default async function OperatorEmployeesPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant || !access.membership) return null;

  const { tenant } = access;
  const supabase = await getWebServerSupabaseClient();

  // Consultar membresías activas y perfiles accesibles vía RLS
  const { data: memberships, error: memErr } = await supabase
    .from('tenant_memberships')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false });

  // Consultar invitaciones activas en el tenant vía RLS
  const { data: invitations, error: invErr } = await supabase
    .from('tenant_invitations')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false });

  // Intentar relacionar con la tabla perfiles para mostrar correos legibles
  const { data: profiles } = await supabase.from('profiles').select('id, email, first_name, last_name');
  const profileMap = new Map<string, any>((profiles || []).map((p: any) => [p.id, p]));

  const memberList = memberships || [];
  const inviteList = invitations || [];

  return (
    <div>
      <PageHeader
        title="Directorio de Personal y Conductores"
        subtitle={`Control de nómina operativa, choferes rodantes y accesos administrativos en ${tenant.display_name}`}
      />

      {memErr && (
        <Alert variant="danger" title="Error al consultar membresías" style={{ marginBottom: '20px' }}>
          {memErr.message}
        </Alert>
      )}

      {/* Sección de Miembros Activos */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1C3B57' }}>
              Nómina Operativa Registrada ({memberList.length})
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
              Usuarios con credenciales verificadas y permisos activos en Postgres RLS.
            </p>
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#2A4010',
              backgroundColor: '#E3FCEF',
              padding: '4px 12px',
              borderRadius: '20px',
            }}
          >
            ✓ RLS PROTECTED VIEW
          </div>
        </div>

        {memberList.length > 0 ? (
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
                <th style={{ padding: '12px 16px' }}>Usuario / Identificación</th>
                <th style={{ padding: '12px 16px' }}>Rol Operativo</th>
                <th style={{ padding: '12px 16px' }}>Estado RLS</th>
                <th style={{ padding: '12px 16px' }}>Fecha de Incorporación</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((m: any) => {
                const p = profileMap.get(m.user_id);
                const emailOrId = p?.email || m.user_id;
                const nameStr =
                  p?.first_name || p?.last_name ? `${p.first_name || ''} ${p.last_name || ''}`.trim() : null;

                const roleStyles: Record<string, { bg: string; color: string }> = {
                  tenant_admin: { bg: '#FEF08A', color: '#854D0E' },
                  driver: { bg: '#E3FCEF', color: '#166534' },
                  operator: { bg: '#E0F2FE', color: '#0369A1' },
                  client: { bg: '#F3E8FF', color: '#6B21A8' },
                };
                const rStyle = roleStyles[m.role] || { bg: '#F1F5F9', color: '#475569' };

                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1C3B57' }}>{emailOrId}</div>
                      {nameStr && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{nameStr}</div>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          backgroundColor: rStyle.bg,
                          color: rStyle.color,
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: m.status === 'active' ? '#166534' : '#991B1B', fontWeight: 700 }}>
                        ● {m.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '13px' }}>
                      {new Date(m.created_at).toLocaleString('es-CL')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: '#64748B',
              backgroundColor: '#F8F9FA',
              borderRadius: '6px',
            }}
          >
            No se encontraron registros activos bajo su contexto en este momento.
          </div>
        )}
      </div>

      {/* Sección de Invitaciones Pendientes */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#1C3B57' }}>
          Tokens de Invitación Emitidos ({inviteList.length})
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
          Historial de invitaciones de acceso generadas para personal operativo en este tenant.
        </p>

        {invErr && (
          <Alert variant="danger" title="Error de lectura RLS en invitaciones" style={{ marginBottom: '16px' }}>
            {invErr.message}
          </Alert>
        )}

        {inviteList.length > 0 ? (
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
                <th style={{ padding: '12px 16px' }}>Correo Electrónico Destino</th>
                <th style={{ padding: '12px 16px' }}>Rol Propuesto</th>
                <th style={{ padding: '12px 16px' }}>Estado del Token</th>
                <th style={{ padding: '12px 16px' }}>Fecha de Emisión</th>
              </tr>
            </thead>
            <tbody>
              {inviteList.map((inv: any) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1C3B57' }}>{inv.normalized_email}</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 500 }}>{inv.role.toUpperCase()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        color: inv.status === 'accepted' ? '#166534' : inv.status === 'revoked' ? '#DC2626' : '#D97706',
                      }}
                    >
                      ● {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '13px' }}>
                    {new Date(inv.created_at).toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#64748B',
              backgroundColor: '#F8F9FA',
              borderRadius: '6px',
              fontStyle: 'italic',
            }}
          >
            No hay invitaciones operativas emitidas o pendientes para este tenant.
          </div>
        )}
      </div>

      {/* Nota Operativa Honesta */}
      <Alert variant="info" title="Gestión Centralizada de Accesos y Seguridad">
        La emisión de nuevos tokens de alta seguridad para administradores del tenant o chóferes rodantes se administra
        bajo estrito control criptográfico en la Consola del SuperAdmin o mediante el canal corporativo de provisión en{' '}
        <strong>/platform</strong>.
      </Alert>
    </div>
  );
}
