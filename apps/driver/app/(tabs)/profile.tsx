import React from 'react';
import { Screen, Card, Alert } from '@transport-platform/ui-native';

export default function ProfileScreen() {
  return (
    <Screen>
      <Card style={{ marginTop: 16 }}>
        <Alert
          title="Datos del Conductor"
          message="La edición de credenciales y parámetros de licencia se gestiona exclusivamente de forma centralizada por el Administrador de Operaciones."
          variant="info"
        />
      </Card>
    </Screen>
  );
}
