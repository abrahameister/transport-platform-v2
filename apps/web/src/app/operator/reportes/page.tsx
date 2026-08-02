import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Reportes | Consola Operador',
  description: 'Informes de cumplimiento de nivel de servicio (SLA), puntualidad y ocupación.',
};

export default async function OperatorReportesPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Reportes de Cumplimiento Operativo y SLA"
        subtitle={`Informes de puntualidad, tasa de ocupación de buses y exportación de nóminas para ${tenant.display_name}`}
      />

      {/* Grid de Reportes Descargables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Reporte de Cumplimiento SLA
          </div>
          <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#1C3B57' }}>
            Puntualidad en Partidas y Llegadas
          </h3>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
            Análisis detallado de desviaciones de horario por chofer, ruta y cliente corporativo.
          </p>
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
            📥 Exportar Informe (.CSV)
          </button>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Reporte de Utilización
          </div>
          <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#1C3B57' }}>
            Ocupación de Asientos y Carga
          </h3>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
            Estadísticas de densidad de pasajeros por turno y optimización de capacidad de bus.
          </p>
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
            📥 Exportar Informe (.CSV)
          </button>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Reporte Mensual B2B
          </div>
          <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#1C3B57' }}>
            Resumen de Consumo por Cliente
          </h3>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', margin: '0 0 16px 0' }}>
            Desglose de servicios ejecutados para facturación y cobro mensual a clientes.
          </p>
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
            📥 Exportar Informe (.CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
