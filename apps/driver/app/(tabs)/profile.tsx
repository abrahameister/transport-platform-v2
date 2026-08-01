import React from 'react';
import { Screen, Card, Alert } from '@transport-platform/ui-native';

export default function ProfileScreen() {
  return (
    <Screen>
      <Card style={{ marginTop: 16 }}>
        <Alert
          title="Perfil del Conductor"
          message="Driver foundation — flujo operacional se implementará en un sprint posterior."
          variant="info"
        />
      </Card>
    </Screen>
  );
}
