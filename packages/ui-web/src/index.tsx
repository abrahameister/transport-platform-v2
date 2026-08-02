'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { semanticTokens, elevation, typography, SemanticTokens } from '@transport-platform/design-tokens';

// --- WHITE-LABEL & THEME PROVIDERS ---
export interface TenantBrandConfig {
  displayName: string;
  shortName: string;
  logoUrl: string;
  faviconUrl: string;
  supportName: string;
  supportEmail: string;
  supportPhone: string;
  semanticColorAliases?: {
    brandPrimary?: string;
  };
  authorizedFontFamily: string;
  locale: string;
  timezone: string;
}

export const defaultBrandConfig: TenantBrandConfig = {
  displayName: 'Transport Platform V2',
  shortName: 'TP-V2',
  logoUrl: '/assets/logo-placeholder.svg',
  faviconUrl: '/favicon.ico',
  supportName: 'Soporte Técnico Transport Platform',
  supportEmail: 'soporte@transportplatform.com',
  supportPhone: '+56 9 0000 0000',
  semanticColorAliases: {
    brandPrimary: semanticTokens.surface.brand,
  },
  authorizedFontFamily: typography.fontFamily.fallback,
  locale: 'es-CL',
  timezone: 'America/Santiago',
};

const BrandContext = createContext<TenantBrandConfig>(defaultBrandConfig);
const ThemeContext = createContext<{ tokens: SemanticTokens }>({ tokens: semanticTokens });

export const BrandProvider: React.FC<{ value?: TenantBrandConfig; children: ReactNode }> = ({
  value = defaultBrandConfig,
  children,
}) => <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;

export const useBrand = () => useContext(BrandContext);

export const ThemeProvider: React.FC<{ tokens?: SemanticTokens; brand?: TenantBrandConfig; children: ReactNode }> = ({
  tokens = semanticTokens,
  brand = defaultBrandConfig,
  children,
}) => (
  <BrandContext.Provider value={brand}>
    <ThemeContext.Provider value={{ tokens }}>{children}</ThemeContext.Provider>
  </BrandContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);

// --- COMPOSITIONS ---
export const ContentContainer: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const { tokens } = useTheme();
  return (
    <div
      className={`content-container ${className}`}
      style={{
        maxWidth: '830px',
        margin: '0 auto',
        padding: '24px 20px',
        backgroundColor: tokens.surface.panel,
        borderRadius: '6px',
        boxShadow: elevation.cardShadow || elevation.officialShadow,
        border: `1px solid ${tokens.border.subtle}`,
      }}
    >
      {children}
    </div>
  );
};

export const OperationalCanvas: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const { tokens } = useTheme();
  return (
    <div
      className={`operational-canvas ${className}`}
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: tokens.surface.canvas,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {children}
    </div>
  );
};

// --- BASE UI COMPONENTS ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, style, ...props }) => {
  const brand = useBrand();
  const { tokens } = useTheme();

  // Duet Solutions Rule: Primary CTA is Orange (#E8832A) for immediate visual dominance
  let bg: string = tokens.surface.cta || '#E8832A';
  let color = tokens.text.onPrimary;
  let border = '1px solid transparent';
  let boxShadow = '0 1px 2px rgba(232, 131, 42, 0.2)';

  if (variant === 'brand') {
    bg = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;
    color = tokens.text.onPrimary;
    boxShadow = '0 1px 2px rgba(28, 59, 87, 0.15)';
  } else if (variant === 'secondary') {
    bg = tokens.surface.panel;
    color = tokens.text.primary;
    border = `1px solid ${tokens.border.standard}`;
    boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)';
  } else if (variant === 'danger') {
    bg = tokens.status.danger.border;
    color = tokens.text.onPrimary;
    boxShadow = 'none';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = brand.semanticColorAliases?.brandPrimary || tokens.text.brand;
    boxShadow = 'none';
  }

  const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '10px 20px' : '8px 16px';
  const fontSize = size === 'sm' ? '13px' : '14px';

  return (
    <button
      style={{
        backgroundColor: bg,
        color,
        border,
        padding,
        fontSize,
        fontFamily: brand.authorizedFontFamily || typography.fontFamily.fallback,
        borderRadius: '4px',
        fontWeight: 600,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        boxShadow,
        transition: 'background-color 0.15s ease, opacity 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const IconButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} style={{ padding: '8px', borderRadius: '4px', ...props.style }} />
);

export const TextField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }> = ({
  label,
  error,
  style,
  id,
  ...props
}) => {
  const { tokens } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 600, color: tokens.text.primary }}>
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: `1px solid ${error ? tokens.status.danger.border : tokens.border.standard}`,
          fontSize: '14px',
          backgroundColor: tokens.surface.panel,
          color: tokens.text.primary,
          outline: 'none',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: tokens.status.danger.text, fontWeight: 500 }}>{error}</span>}
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({
  label,
  children,
  id,
  style,
  ...props
}) => {
  const { tokens } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 600, color: tokens.text.primary }}>
          {label}
        </label>
      )}
      <select
        id={id}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: `1px solid ${tokens.border.standard}`,
          fontSize: '14px',
          backgroundColor: tokens.surface.panel,
          color: tokens.text.primary,
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({
  label,
  id,
  ...props
}) => {
  const { tokens } = useTheme();
  const ctaColor = tokens.surface.cta || '#E8832A';
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: tokens.text.primary,
      }}
    >
      <input id={id} type="checkbox" style={{ accentColor: ctaColor }} {...props} />
      {label && <span style={{ fontWeight: 500 }}>{label}</span>}
    </label>
  );
};

export const Card: React.FC<{ children: ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        backgroundColor: tokens.surface.panel,
        borderRadius: '6px',
        padding: '20px',
        boxShadow: elevation.cardShadow || elevation.officialShadow,
        border: `1px solid ${tokens.border.subtle}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --- HIGH-PRODUCTIVITY OPERATIONAL TABLES ---
export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, style, ...props }) => {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: '6px',
        backgroundColor: tokens.surface.panel,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', ...style }} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, style, ...props }) => {
  const { tokens } = useTheme();
  return (
    <thead
      style={{
        backgroundColor: tokens.surface.brandSubtle || '#F0F4F8',
        borderBottom: `2px solid ${tokens.border.standard}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, style, ...props }) => {
  const { tokens } = useTheme();
  return (
    <tr
      style={{ borderBottom: `1px solid ${tokens.border.subtle}`, transition: 'background-color 0.1s ease', ...style }}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHeaderCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  style,
  ...props
}) => {
  const { tokens } = useTheme();
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '10px 14px',
        color: tokens.text.brand || '#1C3B57',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, style, ...props }) => {
  const { tokens } = useTheme();
  return (
    <td
      style={{ padding: '12px 14px', color: tokens.text.primary, fontSize: '14px', verticalAlign: 'middle', ...style }}
      {...props}
    >
      {children}
    </td>
  );
};

export const Badge: React.FC<{ variant?: 'info' | 'success' | 'warning' | 'danger'; children: ReactNode }> = ({
  variant = 'info',
  children,
}) => {
  const { tokens } = useTheme();
  const statusToken = tokens.status[variant];
  return (
    <span
      style={{
        backgroundColor: statusToken.surface,
        color: statusToken.text,
        border: `1px solid ${statusToken.border}`,
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
};

export const Alert: React.FC<{
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}> = ({ variant = 'info', title, children, style }) => {
  const { tokens } = useTheme();
  const statusToken = tokens.status[variant];
  return (
    <div
      style={{
        backgroundColor: statusToken.surface,
        color: statusToken.text,
        borderLeft: `4px solid ${statusToken.border}`,
        padding: '12px 16px',
        borderRadius: '4px',
        fontSize: '14px',
        ...style,
      }}
    >
      {title && <strong style={{ display: 'block', marginBottom: '4px', fontWeight: 700 }}>{title}</strong>}
      {children}
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; description?: string; action?: ReactNode }> = ({
  title,
  description,
  action,
}) => {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: tokens.surface.panel,
        border: `1px dashed ${tokens.border.standard}`,
        borderRadius: '6px',
      }}
    >
      <h3
        style={{
          margin: '0 0 6px 0',
          fontSize: '16px',
          fontWeight: 700,
          color: tokens.text.brand || tokens.text.primary,
        }}
      >
        {title}
      </h3>
      {description && (
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: tokens.text.secondary }}>{description}</p>
      )}
      {action}
    </div>
  );
};

export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: ReactNode }> = ({
  title,
  subtitle,
  actions,
}) => {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: `1px solid ${tokens.border.subtle}`,
        paddingBottom: '16px',
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 700,
            color: tokens.text.brand || '#1C3B57',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: tokens.text.secondary }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>{actions}</div>}
    </div>
  );
};

export const AppShell: React.FC<{
  title: string;
  brandName?: string;
  children: ReactNode;
  navItems?: { label: string; href: string }[];
}> = ({ title, brandName = 'Transport Platform V2', children, navItems = [] }) => {
  const brand = useBrand();
  const { tokens } = useTheme();
  // Duet Solutions Structural Navy Base (#1C3B57) for navigation header
  const brandBg = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand || '#1C3B57';

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: tokens.surface.canvas }}
    >
      <header
        style={{
          height: '60px',
          backgroundColor: brandBg,
          color: tokens.text.onPrimary,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {brand.logoUrl && <img src={brand.logoUrl} alt={brand.displayName} style={{ height: '32px' }} />}
          <div style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.01em' }} data-testid="brand-name">
            {brand.displayName || brandName}
          </div>
        </div>
        <div style={{ fontSize: '13px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span data-testid="support-info">
            {brand.supportName} ({brand.supportEmail})
          </span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ fontWeight: 600, color: tokens.surface.cta || '#E8832A' }}>{title}</span>
        </div>
      </header>
      {navItems.length > 0 && (
        <nav
          style={{
            backgroundColor: tokens.surface.panel,
            borderBottom: `1px solid ${tokens.border.subtle}`,
            padding: '0 24px',
            display: 'flex',
            gap: '24px',
            height: '44px',
            alignItems: 'center',
            boxShadow: '0 1px 2px rgba(28,59,87,0.03)',
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                color: tokens.text.brand || tokens.text.primary,
                fontSize: '14px',
                fontWeight: 600,
                padding: '10px 0',
                display: 'inline-block',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
      <main style={{ flex: 1, padding: '24px' }}>{children}</main>
    </div>
  );
};

export const Skeleton: React.FC<{ width?: string; height?: string }> = ({ width = '100%', height = '20px' }) => {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: tokens.surface.hover,
        borderRadius: '4px',
      }}
    />
  );
};

export const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const { tokens } = useTheme();
  const spinnerColor = tokens.surface.cta || '#E8832A';

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `3px solid ${tokens.border.subtle}`,
        borderTop: `3px solid ${spinnerColor}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
};
