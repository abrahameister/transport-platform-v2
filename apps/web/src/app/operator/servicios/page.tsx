import React from 'react';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { PageHeader } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Servicios | Consola Operador',
  description: 'Gestión y asignación en tiempo real de servicios y hojas de ruta.',
};

export default async function OperatorServiciosPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant) return null;

  const { tenant } = access;

  const services = [
    {
      id: 'SRV-2026-0891',
      client: 'Minera Los Pelambres',
      route: 'Plaza Italia → Faena Cordillera (Turno A)',
      departure: '06:30 hrs',
      driver: 'Carlos Mendoza',
      vehicle: 'BUS-402 (Mercedes-Benz)',
      passengers: '42 / 45',
      status: 'En curso',
      statusBg: '#E0F2FE',
      statusColor: '#0369A1',
    },
    {
      id: 'SRV-2026-0892',
      client: 'Anglo American Chile',
      route: 'Estación Central → Planta Las Tórtolas',
      departure: '07:00 hrs',
      driver: 'Roberto Silva',
      vehicle: 'BUS-108 (Scania K310)',
      passengers: '38 / 45',
      status: 'Asignado',
      statusBg: '#E3FCEF',
      statusColor: '#166534',
    },
    {
      id: 'SRV-2026-0893',
      client: 'BHP Billiton SpA',
      route: 'Terminal Norte → Campamento Mina 3',
      departure: '07:45 hrs',
      driver: 'Sin asignación',
      vehicle: 'Pendiente',
      passengers: '0 / 45',
      status: 'Sin asignación',
      statusBg: '#FEF08A',
      statusColor: '#854D0E',
    },
    {
      id: 'SRV-2026-0894',
      client: 'Codelco División Andina',
      route: 'Los Andes → Portal Saladillo',
      departure: '08:15 hrs',
      driver: 'Marcelo Ugarte',
      vehicle: 'BUS-205 (Volvo B11R)',
      passengers: '44 / 45',
      status: 'Retrasado',
      statusBg: '#FEE2E2',
      statusColor: '#991B1B',
    },
    {
      id: 'SRV-2026-0895',
      client: 'Antofagasta Minerals',
      route: 'Calama → Mina Centinela (Turno Noche)',
      departure: '20:00 hrs',
      driver: 'Jorge Valenzuela',
      vehicle: 'BUS-501 (Volvo B11R)',
      passengers: '40 / 45',
      status: 'Asignado',
      statusBg: '#E3FCEF',
      statusColor: '#166534',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Calendario y Listado Operacional de Servicios"
        subtitle={`Supervisión y asignación en tiempo real de vehículos, conductores y horarios para ${tenant.display_name}`}
      />

      {/* Bar de Filtros y Búsqueda */}
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
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: '1 1 400px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por código SRV, cliente o ruta..."
            style={{
              padding: '10px 14px',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              fontSize: '13px',
              flex: '1 1 240px',
              outline: 'none',
            }}
          />
          <select
            style={{
              padding: '10px 14px',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              fontSize: '13px',
              backgroundColor: '#FFFFFF',
              color: '#1C3B57',
              fontWeight: 600,
            }}
          >
            <option value="all">Estado: Todos los servicios</option>
            <option value="unassigned">Sin asignación</option>
            <option value="assigned">Asignados</option>
            <option value="in_progress">En curso</option>
            <option value="delayed">Retrasados</option>
          </select>
        </div>

        <button
          style={{
            backgroundColor: '#E8832A',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(232, 131, 42, 0.25)',
          }}
        >
          ➕ Crear Servicio Manual
        </button>
      </div>

      {/* Tabla Detallada de Servicios */}
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
              <th style={{ padding: '12px 14px' }}>Código SRV</th>
              <th style={{ padding: '12px 14px' }}>Cliente Comercial</th>
              <th style={{ padding: '12px 14px' }}>Ruta / Trayecto</th>
              <th style={{ padding: '12px 14px' }}>Hora Salida</th>
              <th style={{ padding: '12px 14px' }}>Conductor Asignado</th>
              <th style={{ padding: '12px 14px' }}>Unidad de Flota</th>
              <th style={{ padding: '12px 14px' }}>Ocupación</th>
              <th style={{ padding: '12px 14px' }}>Estado</th>
              <th style={{ padding: '12px 14px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {services.map((srv) => (
              <tr key={srv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 14px', fontWeight: 700, color: '#1C3B57', fontFamily: 'monospace' }}>
                  {srv.id}
                </td>
                <td style={{ padding: '14px 14px', fontWeight: 600, color: '#1C3B57' }}>{srv.client}</td>
                <td style={{ padding: '14px 14px', color: '#475569' }}>{srv.route}</td>
                <td style={{ padding: '14px 14px', fontWeight: 700, color: '#1C3B57' }}>{srv.departure}</td>
                <td style={{ padding: '14px 14px', color: '#475569' }}>{srv.driver}</td>
                <td style={{ padding: '14px 14px', color: '#475569' }}>{srv.vehicle}</td>
                <td style={{ padding: '14px 14px', fontWeight: 600, color: '#1C3B57' }}>{srv.passengers}</td>
                <td style={{ padding: '14px 14px' }}>
                  <span
                    style={{
                      backgroundColor: srv.statusBg,
                      color: srv.statusColor,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    ● {srv.status}
                  </span>
                </td>
                <td style={{ padding: '14px 14px' }}>
                  <button
                    style={{
                      backgroundColor: '#EEF4F8',
                      color: '#1C3B57',
                      border: '1px solid #CBD5E1',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Asignar / Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
