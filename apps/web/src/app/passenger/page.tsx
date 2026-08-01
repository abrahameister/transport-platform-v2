'use client';

import React from 'react';
import { AppShell, ContentContainer, Alert, PageHeader } from '@transport-platform/ui-web';

export default function PassengerShellPage() {
  return (
    <AppShell title="Pasajero PWA Shell">
      <ContentContainer>
        <PageHeader title="Passenger Shell" subtitle="Fundación técnica productiva" />
        <Alert variant="info" title="Estado de Infraestructura">
          Foundation shell — funcionalidad pendiente de Sprint posterior.
        </Alert>
      </ContentContainer>
    </AppShell>
  );
}
