import React from 'react';
import { AppShell, Alert, PageHeader, ContentContainer } from '@transport-platform/ui-web';

export default function PassengerShellPage() {
  return (
    <AppShell title="Portal Pasajero PWA" brandName="Transport Platform V2">
      <PageHeader title="Passenger Shell" subtitle="PWA del Pasajero" />
      <ContentContainer>
        <Alert variant="info" title="Estado de Infraestructura">
          Foundation shell — funcionalidad pendiente de Sprint posterior.
        </Alert>
      </ContentContainer>
    </AppShell>
  );
}
