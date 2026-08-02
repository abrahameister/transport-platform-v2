import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { getWebServerSupabaseClient } from '@/lib/supabase/server';
import { PageHeader, Alert } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Cuentas de Cliente Comercial | Consola Operador',
  description: 'Directorio de empresas cliente y centros de costo B2B vinculados al tenant.',
};

export default async function OperatorClientsPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant || !access.membership) return null;

  const { tenant } = access;
  const supabase = await getWebServerSupabaseClient();

  // Consultar miembros con rol 'client' vinculados al tenant
  const { data: clients, error } = await supabase
    .from('tenant_memberships')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  const clientList = clients || [];

  return (
    <div>
      <PageHeader
        title="Directorio de Cuentas de Cliente Comercial"
        subtitle={`Administración de empresas contratantes, centros de costo externas y usuarios con acceso al Portal Cliente de ${tenant.display_name}`}
      />

      {error && (
        <Alert variant="danger" title="Error de consulta RLS" style={{ marginBottom: '20px' }}>
          {error.message}
        </Alert>
      )}

      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#1C3B57' }}>
              Cuentas B2B Vinculadas ({clientList.length})
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
              Usuarios comerciales autorizados para consulta de servicios y reportes de facturación bajo su tenant.
            </p>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#475569',
              backgroundColor: '#F1F5F9',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid #CBD5E1',
            }}
          >
            ● RLS ENFORCED
          </span>
        </div>

        {clientList.length > 0 ? (
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
                <th style={{ padding: '12px 16px' }}>Identificador de Usuario / Cuenta</th>
                <th style={{ padding: '12px 16px' }}>Tipo de Acceso</th>
                <th style={{ padding: '12px 16px' }}>Estado RLS</th>
                <th style={{ padding: '12px 16px' }}>Fecha de Vinculación</th>
              </tr>
            </thead>
            <tbody>
              {clientList.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>{c.user_id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        backgroundColor: '#F3E8FF',
                        color: '#6B21A8',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      CLIENT PORTAL
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '14px 16px',
                      fontWeight: 700,
                      color: c.status === 'active' ? '#166534' : '#991B1B',
                    }}
                  >
                    ● {c.status.toUpperCase()}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '13px' }}>
                    {new Date(c.created_at).toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              padding: '36px',
              textAlign: 'center',
              backgroundColor: '#F8F9FA',
              borderRadius: '6px',
              border: '1px dashed #CBD5E1',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1C3B57', marginBottom: '6px' }}>
              Sin cuentas de cliente asociadas
            </div>
            <p style={{ margin: '0 auto', maxWidth: '520px', color: '#64748B', fontSize: '13.5px', lineHeight: '1.5' }}>
              En la versión actual del entorno local DEV no existen cuentas de cliente corporativo externas vinculadas a{' '}
              <strong>{tenant.display_name}</strong>. La habilitación y enlace de portales comerciales para terceros se
              gestiona centralizada desde el módulo corporativo de facturación.
            </p>
          </div>
        )}
      </div>

      <Alert variant="info" title="Información de Integración Comercial">
        Las cuentas de cliente comercial y centros de costo permiten a empresas contratantes consultar el estado de sus
        servicios y descargar nóminas de transporte bajo aislamiento de datos RLS del tenant.
      </Alert>
    </div>
  );
}
