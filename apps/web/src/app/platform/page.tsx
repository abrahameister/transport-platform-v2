'use client';

import React from 'react';
import { AppShell, ContentContainer, Alert, PageHeader } from '@transport-platform/ui-web';

export default function PlatformShellPage() {
  return (
    <AppShell title="SuperAdmin Portal" brandName="Transport Platform V2">
      <ContentContainer>
        <PageHeader title="Platform Shell (SuperAdmin)" subtitle="Fundación técnica productiva" />
        <Alert variant="info" title="Estado de Infraestructura">
          Foundation shell — funcionalidad pendiente de Sprint posterior.
        </Alert>
      </ContentContainer>
    </AppShell>
  );
}
