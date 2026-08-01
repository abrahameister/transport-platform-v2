import { describe, it, expect } from 'vitest';
import { brandFixtures } from './index';

describe('White-Label Brand Fixtures Validation', () => {
  it('exports three synthetic test brand fixtures', () => {
    expect(brandFixtures.transportesAndina).toBeDefined();
    expect(brandFixtures.movilidadCordillera).toBeDefined();
    expect(brandFixtures.transferAustral).toBeDefined();
  });

  it('modifying fixture updates brand colors and details', () => {
    const andina = brandFixtures.transportesAndina!;
    const cordillera = brandFixtures.movilidadCordillera!;

    expect(andina.semanticColorAliases.brandPrimary).not.toBe(cordillera.semanticColorAliases.brandPrimary);
    expect(andina.displayName).toBe('Transportes Andina');
    expect(cordillera.displayName).toBe('Movilidad Cordillera');
  });
});
