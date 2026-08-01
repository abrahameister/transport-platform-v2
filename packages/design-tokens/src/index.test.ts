import { describe, it, expect } from 'vitest';
import { semanticTokens, elevation, typography, OFFICIAL_FONT_FAMILY, NEEDS_SOURCE_VALUE } from './index';

describe('Design Tokens Contract', () => {
  it('exports semantic tokens for latam-b2b/light', () => {
    expect(semanticTokens.text.primary).toBeDefined();
    expect(semanticTokens.surface.canvas).toBeDefined();
    expect(semanticTokens.status.info).toBeDefined();
    expect(semanticTokens.status.success).toBeDefined();
    expect(semanticTokens.status.warning).toBeDefined();
    expect(semanticTokens.status.danger).toBeDefined();
  });

  it('exports the official shadow elevation exact value', () => {
    expect(elevation.officialShadow).toBe('0px 4px 8px rgba(92,92,92,0.08)');
  });

  it('references Latam_Sans font family with fallback', () => {
    expect(OFFICIAL_FONT_FAMILY).toBe('Latam_Sans');
    expect(typography.fontFamily.fallback).toContain('sans-serif');
  });

  it('marks needs source value appropriately', () => {
    expect(NEEDS_SOURCE_VALUE).toBe('NEEDS_SOURCE_VALUE');
  });
});
