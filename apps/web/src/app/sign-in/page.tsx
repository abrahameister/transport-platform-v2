import React from 'react';
import { ContentContainer, Alert, PageHeader, TextField, Button } from '@transport-platform/ui-web';

export default function SignInShellPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F5F7',
        padding: '16px',
      }}
    >
      <ContentContainer>
        <PageHeader title="Iniciar Sesión" subtitle="Transport Platform V2" />
        <Alert variant="info" title="Estado de Infraestructura" style={{ marginBottom: '16px' }}>
          Foundation shell — funcionalidad pendiente de Sprint posterior.
        </Alert>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField label="Correo electrónico" placeholder="usuario@empresa.com" disabled />
          <TextField label="Contraseña" type="password" placeholder="••••••••" disabled />
          <Button type="button" disabled variant="primary">
            Ingresar (Deshabilitado en Sprint 0)
          </Button>
        </form>
      </ContentContainer>
    </div>
  );
}
