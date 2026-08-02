'use client';

import React from 'react';
import { AppShell, ContentContainer, Alert, PageHeader } from '@transport-platform/ui-web';

export default function PassengerShellPage() {
  return (
    <AppShell title="Pasajero PWA Portal">
      <ContentContainer>
        <PageHeader title="Portal del Pasajero" subtitle="Servicios de Transporte Corporatorio" />
        <Alert variant="info" title="Estado Operativo">
          El portal web para consulta de pasajeros no se encuentra activo en este entorno.
        </Alert>
      </ContentContainer>
    </AppShell>
  );
}
