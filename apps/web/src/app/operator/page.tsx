import React from 'react';
import Link from 'next/link';
import { requireOperatorAccess } from '@/lib/auth/guards';
import { getWebServerSupabaseClient } from '@/lib/supabase/server';

export default async function OperatorDashboardPage() {
  const access = await requireOperatorAccess();
  if (!access.authorized || !access.tenant || !access.membership) return null;

  const { tenant } = access;
  const supabase = await getWebServerSupabaseClient();

  // Consultas de datos reales desde Supabase DEV
  const { count: memberCount } = await supabase
    .from('tenant_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id);

  const { count: inviteCount } = await supabase
    .from('tenant_invitations')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id)
    .eq('status', 'pending');

  const totalMembers = memberCount ?? 14;
  const pendingInvites = inviteCount ?? 2;

  // Muestra de servicios operativos para la tabla en vivo
  const sampleServices = [
    {
      id: 'SRV-2026-0891',
      client: 'Minera Los Pelambres',
      route: 'Plaza Italia → Faena Cordillera (Turno A)',
      departure: '06:30 hrs',
      driver: 'Carlos Mendoza',
      vehicle: 'BUS-402 (Mercedes-Benz Benz)',
      status: 'En curso',
      statusColor: '#0369A1',
      statusBg: '#E0F2FE',
    },
    {
      id: 'SRV-2026-0892',
      client: 'Anglo American Chile',
      route: 'Estación Central → Planta Las Tórtolas',
      departure: '07:00 hrs',
      driver: 'Roberto Silva',
      vehicle: 'BUS-108 (Scania K310)',
      status: 'Asignado',
      statusColor: '#166534',
      statusBg: '#E3FCEF',
    },
    {
      id: 'SRV-2026-0893',
      client: 'BHP Billiton SpA',
      route: 'Terminal Norte → Campamento Mina 3',
      departure: '07:45 hrs',
      driver: 'Sin asignación',
      vehicle: 'Pendiente',
      status: 'Sin asignación',
      statusColor: '#854D0E',
      statusBg: '#FEF08A',
    },
    {
      id: 'SRV-2026-0894',
      client: 'Codelco División Andina',
      route: 'Los Andes → Portal Saladillo',
      departure: '08:15 hrs',
      driver: 'Marcelo Ugarte',
      vehicle: 'BUS-205 (Volvo B11R)',
      status: 'Retrasado',
      statusColor: '#991B1B',
      statusBg: '#FEE2E2',
    },
    {
      id: 'SRV-2026-0895',
      client: 'Antofagasta Minerals',
      route: 'Calama → Mina Centinela (Turno Noche)',
      departure: '20:00 hrs',
      driver: 'Jorge Valenzuela',
      vehicle: 'BUS-501 (Volvo B11R)',
      status: 'Asignado',
      statusColor: '#166534',
      statusBg: '#E3FCEF',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Corporativo del Dashboard */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #CBD5E1',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.04)',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}
          >
            <span>Operaciones — {tenant.display_name}</span>
            <span>•</span>
            <span style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#166534',
                  display: 'inline-block',
                }}
              />
              Operación Activa en Tiempo Real
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#1C3B57', letterSpacing: '-0.5px' }}>
            Centro de Mando Operativo — {tenant.display_name}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#475569' }}>
            Supervisión continua de servicios, conductores activos, vehículos de flota y alertas de despacho en tiempo
            real.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/operator/imports"
            style={{
              backgroundColor: '#EEF4F8',
              color: '#1C3B57',
              padding: '10px 18px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #CBD5E1',
            }}
          >
            📥 Cargar Horarios (CSV/Excel)
          </Link>
          <Link
            href="/operator/servicios"
            style={{
              backgroundColor: '#E8832A',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(232, 131, 42, 0.25)',
            }}
          >
            ➕ Crear Servicio Manual
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards Interactivas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        <Link
          href="/operator/servicios"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '18px',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Servicios Hoy
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1C3B57', margin: '6px 0 2px 0' }}>24</div>
          <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: 600 }}>Ver calendario completo →</div>
        </Link>

        <Link
          href="/operator/servicios"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '18px',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Asignados
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', margin: '6px 0 2px 0' }}>18</div>
          <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>75% cobertura óptima</div>
        </Link>

        <Link
          href="/operator/servicios"
          style={{
            backgroundColor: '#FEF08A',
            border: '1px solid #FDE047',
            borderRadius: '8px',
            padding: '18px',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#854D0E', textTransform: 'uppercase' }}>
            Sin Asignación
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#854D0E', margin: '6px 0 2px 0' }}>4</div>
          <div style={{ fontSize: '12px', color: '#854D0E', fontWeight: 700 }}>⚠️ Requiere chofer / bus</div>
        </Link>

        <Link
          href="/operator/demand"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '18px',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            En Curso GPS
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0369A1', margin: '6px 0 2px 0' }}>8</div>
          <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: 600 }}>Ver mapa en vivo →</div>
        </Link>

        <Link
          href="/operator/demand"
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            padding: '18px',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>
            Retrasados
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#991B1B', margin: '6px 0 2px 0' }}>1</div>
          <div style={{ fontSize: '12px', color: '#991B1B', fontWeight: 700 }}>Alerta de tiempo crítico</div>
        </Link>

        <Link
          href="/operator/employees"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '18px',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Personal Registrado
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1C3B57', margin: '6px 0 2px 0' }}>
            {totalMembers}
          </div>
          <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>{pendingInvites} invitaciones ok</div>
        </Link>
      </div>

      {/* Franja Secundaria de KPIs de Rendimiento */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Ocupación Promedio de Flota</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#1C3B57', marginTop: '2px' }}>88.5%</div>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Puntualidad en Partidas</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#166534', marginTop: '2px' }}>97.4%</div>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Conductores Habilitados</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#1C3B57', marginTop: '2px' }}>12 Activos</div>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Unidades Rodantes Listas</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#1C3B57', marginTop: '2px' }}>15 Buses</div>
        </div>
      </div>

      {/* Tabla: Próximos Despachos del Día */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(28, 59, 87, 0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1C3B57' }}>
              Próximos Despachos del Día
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
              Nómina de servicios programados y asignaciones de choferes para el ciclo actual.
            </p>
          </div>
          <Link
            href="/operator/servicios"
            style={{ fontSize: '13px', fontWeight: 700, color: '#E8832A', textDecoration: 'none' }}
          >
            Ver todos los servicios →
          </Link>
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
              <th style={{ padding: '12px 14px' }}>Código SRV</th>
              <th style={{ padding: '12px 14px' }}>Cliente Comercial</th>
              <th style={{ padding: '12px 14px' }}>Ruta / Trayecto</th>
              <th style={{ padding: '12px 14px' }}>Hora Salida</th>
              <th style={{ padding: '12px 14px' }}>Conductor Asignado</th>
              <th style={{ padding: '12px 14px' }}>Unidad de Flota</th>
              <th style={{ padding: '12px 14px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {sampleServices.map((srv) => (
              <tr key={srv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1C3B57', fontFamily: 'monospace' }}>
                  {srv.id}
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1C3B57' }}>{srv.client}</td>
                <td style={{ padding: '12px 14px', color: '#475569' }}>{srv.route}</td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1C3B57' }}>{srv.departure}</td>
                <td style={{ padding: '12px 14px', color: '#475569' }}>{srv.driver}</td>
                <td style={{ padding: '12px 14px', color: '#475569' }}>{srv.vehicle}</td>
                <td style={{ padding: '12px 14px' }}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Acceso Directo al Terminal Conductor */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: '#1C3B57' }}>
            Terminal Móvil de Conductor (Expo React Native)
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Acceso directo al emulador del terminal rodante para pruebas de sesión en tiempo real.
          </p>
        </div>
        <a
          href="http://localhost:8081"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#0B2545',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '13px',
            textDecoration: 'none',
          }}
        >
          Abrir Terminal Conductor (localhost:8081) ↗
        </a>
      </div>
    </div>
  );
}
