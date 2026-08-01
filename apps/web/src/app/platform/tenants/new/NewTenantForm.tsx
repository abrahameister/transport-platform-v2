'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { ContentContainer, Alert, PageHeader, Button } from '@transport-platform/ui-web';
import { createTenantAction } from '@/lib/actions/adminActions';

export function NewTenantForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await createTenantAction(null, formData);
        if (res?.error) {
          setError(res.error);
        }
      } catch (err: any) {
        if (err.message && err.message.includes('NEXT_REDIRECT')) throw err;
        if (err.digest && err.digest.includes('NEXT_REDIRECT')) throw err;
        setError(err.message || 'Error al procesar la creación de empresa.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/platform" style={{ color: '#2563EB', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          ← Volver a Empresas Transportistas
        </Link>
      </div>

      <ContentContainer>
        <PageHeader
          title="Onboarding: Nueva Empresa Transportista"
          subtitle="Crear un tenant en estado inicial (Draft) dentro de Transport Platform"
        />

        {error && (
          <Alert
            variant="danger"
            title="Error en la creación"
            style={{ marginBottom: '20px', backgroundColor: '#FEF2F2', borderColor: '#F87171', color: '#991B1B' }}
          >
            {error}
          </Alert>
        )}

        <Alert variant="info" title="Estado Inicial: Borrador (Draft)" style={{ marginBottom: '24px' }}>
          La empresa será creada como <strong>Borrador</strong>. Podrá modificar la configuración de branding e invitar
          a los administradores del tenant antes de activarla oficialmente.
        </Alert>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label
              style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
            >
              Slug Identificador *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              placeholder="ej: transportes-del-norte"
              pattern="^[a-z0-9-]+$"
              disabled={isPending}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '15px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Identificador URL único en minúsculas, sin espacios (sólo letras, números y guiones).
            </span>
          </div>

          <div>
            <label
              style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
            >
              Razón Social (Legal Name) *
            </label>
            <input
              id="legal_name"
              name="legal_name"
              type="text"
              required
              placeholder="ej: Transportes del Norte SpA"
              disabled={isPending}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '15px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
            >
              Nombre Visible (Display Name) *
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              required
              placeholder="ej: Transportes del Norte"
              disabled={isPending}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '15px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
              >
                Zona Horaria (Timezone)
              </label>
              <select
                id="timezone"
                name="timezone"
                defaultValue="America/Santiago"
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '15px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFF',
                  boxSizing: 'border-box',
                }}
              >
                <option value="America/Santiago">America/Santiago (UTC-3 / UTC-4)</option>
                <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
                <option value="America/Bogota">America/Bogota (UTC-5)</option>
                <option value="America/Buenos_Aires">America/Buenos_Aires (UTC-3)</option>
                <option value="America/Lima">America/Lima (UTC-5)</option>
                <option value="UTC">UTC (Tiempo Universal)</option>
              </select>
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}
              >
                Idioma y Localización (Locale)
              </label>
              <select
                id="locale"
                name="locale"
                defaultValue="es-CL"
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '15px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFF',
                  boxSizing: 'border-box',
                }}
              >
                <option value="es-CL">Spanish (Chile) — es-CL</option>
                <option value="es-MX">Spanish (Mexico) — es-MX</option>
                <option value="es-ES">Spanish (Spain) — es-ES</option>
                <option value="en-US">English (USA) — en-US</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0',
            }}
          >
            <Link
              href="/platform"
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                color: '#475569',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Cancelar
            </Link>
            <Button
              type="submit"
              disabled={isPending}
              variant="primary"
              style={{
                padding: '12px 28px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? 'Creando empresa en Draft...' : 'Crear Empresa Transportista'}
            </Button>
          </div>
        </form>
      </ContentContainer>
    </div>
  );
}
