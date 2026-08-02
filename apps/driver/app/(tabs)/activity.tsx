import React from 'react';
import { Screen, Card, Alert } from '@transport-platform/ui-native';

export default function ActivityScreen() {
  return (
    <Screen>
      <Card style={{ marginTop: 16 }}>
        <Alert
          title="Historial de Actrización"
          message="El registro de servicios previos no se encuentra disponible actualmente para su empresa."
          variant="info"
        />
      </Card>
    </Screen>
  );
}
