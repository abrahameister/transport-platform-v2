'use client';

import React from 'react';
import { AppShell, ContentContainer, Alert, PageHeader } from '@transport-platform/ui-web';

export default function ClientShellPage() {
  return (
    <AppShell title="Empresa Cliente Portal">
      <ContentContainer>
        <PageHeader title="Corporate Client Portal" subtitle="Control Corporativo B2B" />
        <Alert variant="info" title="Estado Operativo">
          El portal web de autoservicio para cuentas de cliente corporativo no se encuentra habilitado en este entorno
          de desarrollo.
        </Alert>
      </ContentContainer>
    </AppShell>
  );
}
