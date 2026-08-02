import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Configuración | Consola Operador',
  description: 'Parámetros del tenant, personalización HSL de marca y preferencias regionales.',
};

export default async function OperatorConfiguracionPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Configuración de Empresa y Marca Corporativa"
        subtitle={`Parámetros de sistema, marca blanca HSL y zona horaria para ${tenant.display_name}`}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800, color: '#1C3B57' }}>
          Parámetros Generales de la Empresa
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label
              style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}
            >
              Nombre Comercial
            </label>
            <input
              type="text"
              defaultValue={tenant.display_name}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                color: '#1C3B57',
                fontWeight: 700,
              }}
            />
          </div>

          <div>
            <label
              style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}
            >
              Razón Social / Nombre Legal
            </label>
            <input
              type="text"
              defaultValue={tenant.legal_name}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                color: '#1C3B57',
                fontWeight: 700,
              }}
            />
          </div>

          <div>
            <label
              style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}
            >
              Zona Horaria Regional
            </label>
            <input
              type="text"
              defaultValue={tenant.timezone}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                color: '#1C3B57',
                fontWeight: 700,
              }}
            />
          </div>

          <div>
            <label
              style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}
            >
              Idioma y Región
            </label>
            <input
              type="text"
              defaultValue={tenant.locale}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                color: '#1C3B57',
                fontWeight: 700,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
