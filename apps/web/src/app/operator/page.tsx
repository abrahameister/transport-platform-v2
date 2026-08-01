import React from 'react';
import { AppShell, Alert, PageHeader, OperationalCanvas } from '@transport-platform/ui-web';

export default function OperatorShellPage() {
  return (
    <AppShell title="Portal Empresa Transportista" brandName="Transport Platform V2">
      <PageHeader title="Transporter Shell" subtitle="Consola de Operaciones y Monitoreo" />
      <OperationalCanvas>
        <Alert variant="info" title="Estado de Infraestructura">
          Foundation shell — funcionalidad pendiente de Sprint posterior.
        </Alert>
      </OperationalCanvas>
    </AppShell>
  );
}
