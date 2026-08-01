import React from 'react';
import { Screen, Card, Alert } from '@transport-platform/ui-native';

export default function TodayScreen() {
  return (
    <Screen>
      <Card style={{ marginTop: 16 }}>
        <Alert
          title="Modo Base Conductor"
          message="Driver foundation — flujo operacional se implementará en un sprint posterior."
          variant="info"
        />
      </Card>
    </Screen>
  );
}
