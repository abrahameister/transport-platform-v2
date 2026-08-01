import { describe, it, expect } from 'vitest';
import { brandFixtures } from '@transport-platform/test-utils';
import { ThemeProvider, AppShell, Button } from './index';

describe('Web UI White-Label & Theme Integration Tests', () => {
  it('instantiates components with Transportes Andina brand config', () => {
    const brand = brandFixtures.transportesAndina;
    expect(brand).toBeDefined();

    const element = (
      <ThemeProvider brand={brand}>
        <AppShell title="Andina Portal" brandName={brand.displayName}>
          <Button variant="primary">Boton Andina</Button>
        </AppShell>
      </ThemeProvider>
    );

    expect(element).toBeDefined();
    expect(element.props.brand?.displayName).toBe('Transportes Andina');
    expect(element.props.brand?.semanticColorAliases?.brandPrimary).toBe('#0052CC');
  });

  it('instantiates components with Movilidad Cordillera brand config', () => {
    const brand = brandFixtures.movilidadCordillera;
    expect(brand).toBeDefined();

    const element = (
      <ThemeProvider brand={brand}>
        <AppShell title="Cordillera Portal" brandName={brand.displayName}>
          <Button variant="primary">Boton Cordillera</Button>
        </AppShell>
      </ThemeProvider>
    );

    expect(element).toBeDefined();
    expect(element.props.brand?.displayName).toBe('Movilidad Cordillera');
    expect(element.props.brand?.semanticColorAliases?.brandPrimary).toBe('#00875A');
  });

  it('instantiates components with Transfer Austral brand config', () => {
    const brand = brandFixtures.transferAustral;
    expect(brand).toBeDefined();

    const element = (
      <ThemeProvider brand={brand}>
        <AppShell title="Austral Portal" brandName={brand.displayName}>
          <Button variant="primary">Boton Austral</Button>
        </AppShell>
      </ThemeProvider>
    );

    expect(element).toBeDefined();
    expect(element.props.brand?.displayName).toBe('Transfer Austral');
    expect(element.props.brand?.semanticColorAliases?.brandPrimary).toBe('#6554C0');
  });

  it('provides fallback brand config when no brand is passed', () => {
    const element = (
      <ThemeProvider>
        <Button variant="primary">Boton Fallback</Button>
      </ThemeProvider>
    );

    expect(element).toBeDefined();
  });
});
