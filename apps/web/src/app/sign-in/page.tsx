import React, { Suspense } from 'react';
import { SignInForm } from './SignInForm';
import { Spinner } from '@transport-platform/ui-web';

export const metadata = {
  title: 'Iniciar Sesión | Transport Platform V2',
  description: 'Portal de autenticación seguro para Operadores, Transportistas y SuperAdmins.',
};

export default function SignInPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <Suspense
          fallback={
            <div style={{ textAlign: 'center', padding: '40px', color: '#FFF' }}>
              <Spinner size={32} />
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#CBD5E1' }}>Cargando portal seguro...</p>
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
