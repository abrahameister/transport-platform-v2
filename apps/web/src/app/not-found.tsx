import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '64px 16px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '36px', color: '#BF2600' }}>404 — Página no encontrada</h1>
      <p style={{ color: '#5C5C5C', marginBottom: '24px' }}>
        La ruta solicitada no existe dentro de la infraestructura base.
      </p>
      <Link href="/" style={{ color: '#0052CC', textDecoration: 'none', fontWeight: 600 }}>
        ← Volver al estado del sistema
      </Link>
    </div>
  );
}
