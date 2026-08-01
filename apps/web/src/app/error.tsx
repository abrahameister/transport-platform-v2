'use client';

import React from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      style={{
        padding: '32px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h2 style={{ color: '#BF2600' }}>Error de Infraestructura</h2>
      <p style={{ color: '#5C5C5C' }}>{error.message || 'Ocurrió un error inesperado.'}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0052CC',
          color: '#FFF',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
