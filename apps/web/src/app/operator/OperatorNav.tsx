'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: '📊 Panel Operativo', href: '/operator', exact: true },
  { label: '👥 Personal y Conductores', href: '/operator/employees', exact: false },
  { label: '🏢 Cuentas Cliente', href: '/operator/clients', exact: false },
  { label: '📥 Importaciones de Datos', href: '/operator/imports', exact: false },
  { label: '📈 Demanda y Capacidad', href: '/operator/demand', exact: false },
];

export function OperatorNav() {
  const pathname = usePathname() || '';

  return (
    <nav
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '2px solid #E2E8F0',
        padding: '0 36px',
        display: 'flex',
        gap: '8px',
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
              padding: '12px 18px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#1C3B57' : '#64748B',
              borderBottom: isActive ? '3px solid #E8832A' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.15s ease',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
