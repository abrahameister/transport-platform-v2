import { describe, it, expect } from 'vitest';
import { brandFixtures } from '@transport-platform/test-utils';
import { NativeThemeProvider, Screen, Card, Button, Badge } from './index';

describe('Native UI White-Label & Theme Contract Tests', () => {
  it('instantiates components with Transportes Andina brand config', () => {
    const brand = brandFixtures.transportesAndina;

    const element = (
      <NativeThemeProvider brand={brand}>
        <Screen testID="driver-screen">
          <Card testID="driver-card">
            <Badge label="Andina Badge" variant="info" testID="driver-badge" />
            <Button title="Boton Andina" onPress={() => {}} testID="driver-button" />
          </Card>
        </Screen>
      </NativeThemeProvider>
    );

    expect(element).toBeDefined();
    expect(element.props.brand?.displayName).toBe('Transportes Andina');
    expect(element.props.brand?.semanticColorAliases?.brandPrimary).toBe('#0052CC');
  });

  it('instantiates components with Movilidad Cordillera brand config', () => {
    const brand = brandFixtures.movilidadCordillera;

    const element = (
      <NativeThemeProvider brand={brand}>
        <Screen testID="driver-screen">
          <Card testID="driver-card">
            <Button title="Boton Cordillera" onPress={() => {}} testID="driver-button" />
          </Card>
        </Screen>
      </NativeThemeProvider>
    );

    expect(element).toBeDefined();
    expect(element.props.brand?.displayName).toBe('Movilidad Cordillera');
    expect(element.props.brand?.semanticColorAliases?.brandPrimary).toBe('#00875A');
  });

  it('instantiates components with Transfer Austral brand config', () => {
    const brand = brandFixtures.transferAustral;

    const element = (
      <NativeThemeProvider brand={brand}>
        <Screen testID="driver-screen">
          <Button title="Boton Austral" onPress={() => {}} testID="driver-button" />
        </Screen>
      </NativeThemeProvider>
    );

    expect(element).toBeDefined();
    expect(element.props.brand?.displayName).toBe('Transfer Austral');
    expect(element.props.brand?.semanticColorAliases?.brandPrimary).toBe('#6554C0');
  });
});
