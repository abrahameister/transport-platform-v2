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
        <Alert variant="danger" title="Error de autenticación" style={{ marginBottom: '16px' }}>
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
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          variant="primary"
          style={{
            padding: '12px 20px',
            fontSize: '15px',
            width: '100%',
          }}
        >
          {isPending ? 'Verificando credenciales...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div style={{ marginTop: '32px', borderTop: '1px solid #E2E8F0', paddingTop: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#4A5568', margin: 0 }}>
          Protected by Supabase Security Spine & RLS Enforcement. Duet Solutions Visual System.
        </p>
      </div>
    </ContentContainer>
  );
}
