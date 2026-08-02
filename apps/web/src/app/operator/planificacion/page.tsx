import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Planificación | Consola Operador',
  description: 'Programación semanal de rutas, matriz de turnos y asignaciones.',
};

export default async function OperatorPlanificacionPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  const weekDays = [
    { name: 'Lunes 03', services: 24, assigned: 24, status: 'Completo' },
    { name: 'Martes 04', services: 24, assigned: 22, status: 'Pendiente 2' },
    { name: 'Miércoles 05', services: 26, assigned: 20, status: 'Pendiente 6' },
    { name: 'Jueves 06', services: 24, assigned: 18, status: 'Pendiente 6' },
    { name: 'Viernes 07', services: 28, assigned: 15, status: 'Pendiente 13' },
    { name: 'Sábado 08', services: 12, assigned: 12, status: 'Completo' },
    { name: 'Domingo 09', services: 8, assigned: 8, status: 'Completo' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Planificación y Programación Semanal de Rutas"
        subtitle={`Gestión de agendas recurrentes, matriz de turnos y capacidad operativa para ${tenant.display_name}`}
      />

      {/* Selector de Ciclo Semanal */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Ciclo Operativo Activo
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#1C3B57', marginTop: '2px' }}>
            Semana 32 (03 de Agosto — 09 de Agosto, 2026)
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              backgroundColor: '#EEF4F8',
              color: '#1C3B57',
              border: '1px solid #CBD5E1',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            ← Semana Anterior
          </button>
          <button
            style={{
              backgroundColor: '#0B2545',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Semana Siguiente →
          </button>
        </div>
      </div>

      {/* Grid de Programación Diaria */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {weekDays.map((day) => (
          <div
            key={day.name}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '18px',
              boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1C3B57' }}>{day.name}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1C3B57', margin: '8px 0 4px 0' }}>
              {day.services} SRV
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{day.assigned} asignados</div>
            <div
              style={{
                marginTop: '12px',
                fontSize: '11px',
                fontWeight: 700,
                color: day.assigned === day.services ? '#166534' : '#854D0E',
                backgroundColor: day.assigned === day.services ? '#E3FCEF' : '#FEF08A',
                padding: '3px 8px',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              ● {day.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
