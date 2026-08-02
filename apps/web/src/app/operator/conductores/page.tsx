import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Conductores | Consola Operador',
  description: 'Directorio de chóferes rodantes, licencias y vehículos asignados.',
};

export default async function OperatorConductoresPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  const drivers = [
    {
      name: 'Carlos Mendoza',
      rut: '14.285.912-K',
      license: 'A3 (Vence 12/2028)',
      vehicle: 'BUS-402',
      status: 'En servicio',
      bg: '#E0F2FE',
      color: '#0369A1',
    },
    {
      name: 'Roberto Silva',
      rut: '15.932.104-5',
      license: 'A3 (Vence 05/2027)',
      vehicle: 'BUS-108',
      status: 'Disponible',
      bg: '#E3FCEF',
      color: '#166534',
    },
    {
      name: 'Marcelo Ugarte',
      rut: '13.840.119-2',
      license: 'A5 (Vence 10/2029)',
      vehicle: 'BUS-205',
      status: 'En servicio',
      bg: '#E0F2FE',
      color: '#0369A1',
    },
    {
      name: 'Jorge Valenzuela',
      rut: '16.102.483-8',
      license: 'A3 (Vence 08/2026)',
      vehicle: 'BUS-501',
      status: 'Disponible',
      bg: '#E3FCEF',
      color: '#166534',
    },
    {
      name: 'Esteban Paredes',
      rut: '12.903.481-1',
      license: 'A3 (Vence 11/2027)',
      vehicle: 'Sin asignación',
      status: 'Licencia',
      bg: '#FEF08A',
      color: '#854D0E',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Nómina Operativa de Conductores Rodantes"
        subtitle={`Control de chóferes, clases de licencia y asignación de unidades para ${tenant.display_name}`}
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
              <th style={{ padding: '12px 16px' }}>Nombre del Conductor</th>
              <th style={{ padding: '12px 16px' }}>RUT</th>
              <th style={{ padding: '12px 16px' }}>Licencia Profesional</th>
              <th style={{ padding: '12px 16px' }}>Bus Asignado</th>
              <th style={{ padding: '12px 16px' }}>Estado Operativo</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.rut} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C3B57' }}>{d.name}</td>
                <td style={{ padding: '14px 16px', color: '#475569', fontFamily: 'monospace' }}>{d.rut}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{d.license}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C3B57' }}>{d.vehicle}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      backgroundColor: d.bg,
                      color: d.color,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    ● {d.status}
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
