import { describe, it, expect } from 'vitest';
import { defaultBrandConfig } from './index';

describe('UI Web Package Baseline', () => {
  it('exports defaultBrandConfig with fallback typography', () => {
    expect(defaultBrandConfig.displayName).toBe('Transport Platform V2');
    expect(defaultBrandConfig.authorizedFontFamily).toBeDefined();
  });
});
