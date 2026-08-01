import React from 'react';
import { AppShell, Alert, PageHeader, ContentContainer } from '@transport-platform/ui-web';

export default function ClientShellPage() {
  return (
    <AppShell title="Portal Empresa Cliente" brandName="Transport Platform V2">
      <PageHeader title="Corporate Client Shell" subtitle="Gestión de Solicitudes y Colaboradores" />
      <ContentContainer>
        <Alert variant="info" title="Estado de Infraestructura">
          Foundation shell — funcionalidad pendiente de Sprint posterior.
        </Alert>
      </ContentContainer>
    </AppShell>
  );
}
