'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: '📊 Inicio', href: '/operator', exact: true },
  { label: '🚌 Servicios', href: '/operator/servicios', exact: false },
  { label: '📅 Planificación', href: '/operator/planificacion', exact: false },
  { label: '📥 Carga Horarios', href: '/operator/imports', exact: false },
  { label: '👥 Funcionarios', href: '/operator/employees', exact: false },
  { label: '👨‍✈️ Conductores', href: '/operator/conductores', exact: false },
  { label: '🚍 Vehículos', href: '/operator/vehiculos', exact: false },
  { label: '📍 Seguimiento GPS', href: '/operator/demand', exact: false },
  { label: '🏢 Clientes', href: '/operator/clients', exact: false },
  { label: '💵 Tarifas', href: '/operator/tarifas', exact: false },
  { label: '📈 Reportes', href: '/operator/reportes', exact: false },
  { label: '⚙️ Configuración', href: '/operator/configuracion', exact: false },
];

export function OperatorNav() {
  const pathname = usePathname() || '';

  return (
    <nav
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '2px solid #E2E8F0',
        padding: '0 24px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 2px rgba(28, 59, 87, 0.02)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '12px 14px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#1C3B57' : '#64748B',
              borderBottom: isActive ? '3px solid #E8832A' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
