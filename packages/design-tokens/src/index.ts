/**
 * LATAM Design System Tokens — Transport Platform V2
 *
 * Source of truth for semantic design tokens as contracted in docs/product/10-design-system-contract.md.
 * Note: Primitive colors and font files are explicitly flagged as NEEDS_SOURCE_VALUE until authorized source assets arrive.
 */

export const NEEDS_SOURCE_VALUE = 'NEEDS_SOURCE_VALUE' as const;

export const developmentFallbackMeta = {
  status: NEEDS_SOURCE_VALUE,
  productionApproved: false,
  message:
    'Primitive colors and font files must not be used directly in production UI. All components consume semantic tokens.',
};

export const OFFICIAL_FONT_FAMILY = 'Latam_Sans' as const;
export const FONT_FALLBACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Open Sans", "Helvetica Neue", sans-serif' as const;

export const typography = {
  fontFamily: {
    official: OFFICIAL_FONT_FAMILY,
    fallback: FONT_FALLBACK,
    cssVariable: 'var(--font-latam-sans, system-ui, -apple-system, sans-serif)',
  },
  scale: {
    displayLg: { fontSize: 48, lineHeight: 62, letterSpacing: -0.5, fontWeight: '700' },
    displayMd: { fontSize: 40, lineHeight: 52, letterSpacing: -0.5, fontWeight: '700' },
    headingXl: { fontSize: 32, lineHeight: 42, letterSpacing: 0.25, fontWeight: '700' },
    headingLg: { fontSize: 28, lineHeight: 36, letterSpacing: 0.25, fontWeight: '700' },
    headingMd: { fontSize: 24, lineHeight: 32, letterSpacing: 0.25, fontWeight: '700' },
    headingSm: { fontSize: 20, lineHeight: 26, letterSpacing: 0.25, fontWeight: '700' },
    headingXs: { fontSize: 20, lineHeight: 26, letterSpacing: 0.25, fontWeight: '700' },
    bodyLg: { fontSize: 18, lineHeight: 24, letterSpacing: 0.25, fontWeight: '400' },
    bodyMd: { fontSize: 16, lineHeight: 22, letterSpacing: 0.25, fontWeight: '400' },
    bodySm: { fontSize: 14, lineHeight: 18, letterSpacing: 0.25, fontWeight: '400' },
    labelLg: { fontSize: 18, lineHeight: 18, letterSpacing: 0, fontWeight: '400' },
    labelMd: { fontSize: 16, lineHeight: 16, letterSpacing: 0, fontWeight: '400' },
    labelSm: { fontSize: 14, lineHeight: 14, letterSpacing: 0, fontWeight: '400' },
    labelXs: { fontSize: 12, lineHeight: 12, letterSpacing: 0, fontWeight: '400' },
  },
};

export const elevation = {
  officialShadow: '0px 4px 8px rgba(92,92,92,0.08)',
  cardShadow: '0px 1px 3px rgba(28, 59, 87, 0.06), 0px 1px 2px rgba(28, 59, 87, 0.04)',
};

export const breakpoints = {
  small: { width: 328, marginH: 16, marginV: 24 },
  medium: { width: 736, marginH: 24, marginV: 32 },
  large: { width: 830, marginH: 40, marginV: 40 },
  extraLarge: { width: 830, marginH: 40, marginV: 40 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

export interface SemanticTokens {
  text: {
    primary: string;
    secondary: string;
    muted: string;
    onPrimary: string;
    onStatus: string;
    brand: string;
    cta?: string;
  };
  surface: {
    canvas: string;
    panel: string;
    elevated: string;
    hover: string;
    selected: string;
    brand: string;
    brandSubtle: string;
    cta?: string;
    ctaSubtle?: string;
  };
  icon: {
    primary: string;
    secondary: string;
    brand: string;
    cta?: string;
  };
  border: {
    subtle: string;
    standard: string;
    focus: string;
    cta?: string;
  };
  status: {
    info: { surface: string; text: string; border: string };
    success: { surface: string; text: string; border: string };
    warning: { surface: string; text: string; border: string };
    danger: { surface: string; text: string; border: string };
  };
  interaction: {
    primaryHover: string;
    primaryActive: string;
    disabled: string;
    ctaHover?: string;
    ctaActive?: string;
  };
}

/**
 * Official Contract Collection: latam-b2b/light (Duet Solutions B2B Visual System)
 * All components consume semantic tokens via ThemeProvider.
 */
export const semanticTokens: SemanticTokens = {
  text: {
    primary: '#1A2332',
    secondary: '#4A5568',
    muted: '#718096',
    onPrimary: '#FFFFFF',
    onStatus: '#FFFFFF',
    brand: '#1C3B57',
    cta: '#E8832A',
  },
  surface: {
    canvas: '#F8F9FA',
    panel: '#FFFFFF',
    elevated: '#FFFFFF',
    hover: '#F1F5F9',
    selected: '#E2E8F0',
    brand: '#1C3B57',
    brandSubtle: '#F0F4F8',
    cta: '#E8832A',
    ctaSubtle: '#FFF5EB',
  },
  icon: {
    primary: '#1A2332',
    secondary: '#4A5568',
    brand: '#1C3B57',
    cta: '#E8832A',
  },
  border: {
    subtle: '#E2E8F0',
    standard: '#CBD5E1',
    focus: '#1C3B57',
    cta: '#E8832A',
  },
  status: {
    info: { surface: '#EFF6FF', text: '#1E40AF', border: '#3B82F6' },
    success: { surface: '#F0F7E6', text: '#2A4010', border: '#88A947' },
    warning: { surface: '#FEFCE8', text: '#854D0E', border: '#EAB308' },
    danger: { surface: '#FEF2F2', text: '#991B1B', border: '#DC2626' },
  },
  interaction: {
    primaryHover: '#152C42',
    primaryActive: '#0F2032',
    disabled: '#94A3B8',
    ctaHover: '#D6721E',
    ctaActive: '#BF6114',
  },
};
