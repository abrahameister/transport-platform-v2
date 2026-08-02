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
        backgroundColor: '#F8F9FA',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <Suspense
          fallback={
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spinner size={32} />
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#4A5568', fontWeight: 600 }}>
                Cargando portal seguro...
              </p>
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
