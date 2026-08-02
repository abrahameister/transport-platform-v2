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
      <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1C3B57' }}>404 — Página no encontrada</h1>
      <p style={{ color: '#64748B', marginBottom: '24px', fontSize: '15px' }}>
        La ruta solicitada no existe dentro de la infraestructura base.
      </p>
      <Link href="/" style={{ color: '#1C3B57', textDecoration: 'none', fontWeight: 600 }}>
        ← Volver al estado del sistema
      </Link>
    </div>
  );
}
