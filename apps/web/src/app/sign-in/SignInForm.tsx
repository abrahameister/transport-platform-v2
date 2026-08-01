'use client';

import React, { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentContainer, Alert, PageHeader, TextField, Button } from '@transport-platform/ui-web';
import { signInAction } from '@/lib/actions/authActions';

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect') || '';

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (redirectParam) {
      formData.append('redirect', redirectParam);
    }

    startTransition(async () => {
      try {
        const res = await signInAction(null, formData);
        if (res?.error) {
          setError(res.error);
        }
      } catch (err: any) {
        // En Next.js un redirect se lanza como excepción, debemos permitir que siga su curso
        if (err.message && err.message.includes('NEXT_REDIRECT')) throw err;
        if (err.digest && err.digest.includes('NEXT_REDIRECT')) throw err;
        setError(err.message || 'Error inesperado en el inicio de sesión.');
      }
    });
  };

  return (
    <ContentContainer>
      <PageHeader title="Transport Platform V2" subtitle="Ingreso Seguro al Ecosistema Productivo" />

      {error && (
        <Alert
          variant="danger"
          title="Error de autenticación"
          style={{ marginBottom: '16px', backgroundColor: '#FEF2F2', borderColor: '#F87171', color: '#991B1B' }}
        >
          {error}
        </Alert>
      )}

      {redirectParam && !error && (
        <Alert variant="info" title="Redirección pendiente" style={{ marginBottom: '16px' }}>
          Inicie sesión para acceder directamente a: <strong>{redirectParam}</strong>
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
        <div>
          <TextField
            id="email"
            name="email"
            type="email"
            required
            label="Correo Electrónico de Usuario"
            placeholder="ej: platform.admin.dev@example.com"
            disabled={isPending}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '15px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
            }}
          />
        </div>

        <div>
          <TextField
            id="password"
            name="password"
            type="password"
            required
            label="Contraseña de Acceso"
            placeholder="••••••••••••"
            disabled={isPending}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '15px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          variant="primary"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            color: '#FFFFFF',
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {isPending ? 'Verificando credenciales...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div style={{ marginTop: '32px', borderTop: '1px solid #E2E8F0', paddingTop: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
          Protected by Supabase Security Spine & RLS Enforcement. Monolithic Modular Architecture.
        </p>
      </div>
    </ContentContainer>
  );
}
