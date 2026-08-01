import React from 'react';
import { AppShell, Alert, PageHeader, ContentContainer } from '@transport-platform/ui-web';

export default function PlatformShellPage() {
  return (
    <AppShell title="SuperAdmin Portal" brandName="Transport Platform V2">
      <PageHeader title="Platform Shell" subtitle="Portal del Superadministrador de la Plataforma" />
      <ContentContainer>
        <Alert variant="info" title="Estado de Infraestructura">
          Foundation shell — funcionalidad pendiente de Sprint posterior.
        </Alert>
      </ContentContainer>
    </AppShell>
  );
}
