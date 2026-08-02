import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Tarifas | Consola Operador',
  description: 'Matriz de valorización de servicios, tarifas por km y facturación B2B.',
};

export default async function OperatorTarifasPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  const tariffs = [
    {
      client: 'Minera Los Pelambres',
      route: 'Plaza Italia → Faena Cordillera',
      type: 'Bus 45p High-Deck',
      price: '$280.000 CLP / servicio',
      status: 'Vigente',
    },
    {
      client: 'Anglo American Chile',
      route: 'Estación Central → Planta Las Tórtolas',
      type: 'Bus 45p Standard',
      price: '$220.000 CLP / servicio',
      status: 'Vigente',
    },
    {
      client: 'BHP Billiton SpA',
      route: 'Terminal Norte → Campamento Mina 3',
      type: 'Bus 45p High-Deck',
      price: '$310.000 CLP / servicio',
      status: 'Vigente',
    },
    {
      client: 'Codelco División Andina',
      route: 'Los Andes → Portal Saladillo',
      type: 'Bus 45p 4x4 Mountain',
      price: '$350.000 CLP / servicio',
      status: 'Vigente',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Matriz de Tarifas y Valorización Comercial"
        subtitle={`Esquema de precios, acuerdos contractuales por cliente B2B y reglas de facturación para ${tenant.display_name}`}
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
              <th style={{ padding: '12px 16px' }}>Cliente Contratante</th>
              <th style={{ padding: '12px 16px' }}>Ruta / Trayecto</th>
              <th style={{ padding: '12px 16px' }}>Tipo de Vehículo Exigido</th>
              <th style={{ padding: '12px 16px' }}>Tarifa Base Acordada</th>
              <th style={{ padding: '12px 16px' }}>Estado Contrato</th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((t) => (
              <tr key={t.client + t.route} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C3B57' }}>{t.client}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{t.route}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{t.type}</td>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#166534' }}>{t.price}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      backgroundColor: '#E3FCEF',
                      color: '#166534',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    ● {t.status}
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
