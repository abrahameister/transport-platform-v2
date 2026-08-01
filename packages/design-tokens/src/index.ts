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
export const FONT_FALLBACK = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' as const;

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
  };
  surface: {
    canvas: string;
    panel: string;
    elevated: string;
    hover: string;
    selected: string;
    brand: string;
    brandSubtle: string;
  };
  icon: {
    primary: string;
    secondary: string;
    brand: string;
  };
  border: {
    subtle: string;
    standard: string;
    focus: string;
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
  };
}

/**
 * Official Contract Collection: latam-b2b/light
 * All components consume semantic tokens via ThemeProvider.
 */
export const semanticTokens: SemanticTokens = {
  text: {
    primary: '#1A1A1A',
    secondary: '#5C5C5C',
    muted: '#8C8C8C',
    onPrimary: '#FFFFFF',
    onStatus: '#FFFFFF',
    brand: '#0052CC',
  },
  surface: {
    canvas: '#F4F5F7',
    panel: '#FFFFFF',
    elevated: '#FFFFFF',
    hover: '#EBECF0',
    selected: '#DEEBFF',
    brand: '#0052CC',
    brandSubtle: '#DEEBFF',
  },
  icon: {
    primary: '#1A1A1A',
    secondary: '#5C5C5C',
    brand: '#0052CC',
  },
  border: {
    subtle: '#E0E0E0',
    standard: '#C1C7D0',
    focus: '#0052CC',
  },
  status: {
    info: { surface: '#DEEBFF', text: '#0747A6', border: '#4C9AFF' },
    success: { surface: '#E3FCEF', text: '#006644', border: '#57D9A3' },
    warning: { surface: '#FFF0B3', text: '#172B4D', border: '#FFC400' },
    danger: { surface: '#FFEBE6', text: '#BF2600', border: '#FF8F73' },
  },
  interaction: {
    primaryHover: '#0065FF',
    primaryActive: '#0047B3',
    disabled: '#A5ADBA',
  },
};
