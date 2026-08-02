import React from 'react';
import { Screen, Card, Alert } from '@transport-platform/ui-native';

export default function TodayScreen() {
  return (
    <Screen>
      <Card style={{ marginTop: 16 }}>
        <Alert
          title="Estado del Terminal"
          message="El módulo de servicios diarios y hoja de ruta no se encuentra habilitado en su cuenta para este entorno."
          variant="info"
        />
      </Card>
    </Screen>
  );
}
