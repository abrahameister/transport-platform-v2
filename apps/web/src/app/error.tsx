'use client';

import React from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      style={{
        padding: '40px 32px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h2 style={{ color: '#1C3B57', fontSize: '22px', fontWeight: 700 }}>Error de Infraestructura</h2>
      <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '15px' }}>
        {error.message || 'Ocurrió un error inesperado.'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#E8832A',
          color: '#FFF',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(232, 131, 42, 0.25)',
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
