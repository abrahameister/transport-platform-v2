import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Vehículos | Consola Operador',
  description: 'Inventario de flota, capacidad de asientos y estado de mantenimiento.',
};

export default async function OperatorVehiculosPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  const fleet = [
    {
      code: 'BUS-402',
      plate: 'KPSD-42',
      model: 'Mercedes-Benz O500RS',
      seats: '45 asientos',
      status: 'En ruta',
      bg: '#E0F2FE',
      color: '#0369A1',
    },
    {
      code: 'BUS-108',
      plate: 'LXTR-90',
      model: 'Scania K310 Tour',
      seats: '45 asientos',
      status: 'Disponible',
      bg: '#E3FCEF',
      color: '#166534',
    },
    {
      code: 'BUS-205',
      plate: 'HGBR-14',
      model: 'Volvo B11R 430HP',
      seats: '45 asientos',
      status: 'En ruta',
      bg: '#E0F2FE',
      color: '#0369A1',
    },
    {
      code: 'BUS-501',
      plate: 'PXWD-88',
      model: 'Volvo B11R 430HP',
      seats: '45 asientos',
      status: 'Disponible',
      bg: '#E3FCEF',
      color: '#166534',
    },
    {
      code: 'BUS-309',
      plate: 'JLFT-55',
      model: 'Mercedes-Benz Sprinter',
      seats: '19 asientos',
      status: 'Mantenimiento',
      bg: '#FEE2E2',
      color: '#991B1B',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Inventario de Flota y Unidades Rodantes"
        subtitle={`Gestión de patentes, capacidad de transporte y estado mecánico para ${tenant.display_name}`}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
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
              <th style={{ padding: '12px 16px' }}>Código Bus</th>
              <th style={{ padding: '12px 16px' }}>Patente</th>
              <th style={{ padding: '12px 16px' }}>Modelo y Motorización</th>
              <th style={{ padding: '12px 16px' }}>Capacidad</th>
              <th style={{ padding: '12px 16px' }}>Estado Mecánico / Ruta</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map((v) => (
              <tr key={v.code} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C3B57', fontFamily: 'monospace' }}>
                  {v.code}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C3B57' }}>{v.plate}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{v.model}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{v.seats}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      backgroundColor: v.bg,
                      color: v.color,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    ● {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
