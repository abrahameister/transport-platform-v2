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
        padding: '24px 16px',
        backgroundColor: tokens.surface.panel,
        borderRadius: '8px',
        boxShadow: elevation.officialShadow,
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
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: tokens.surface.canvas,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {children}
    </div>
  );
};

// --- BASE UI COMPONENTS ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, style, ...props }) => {
  const brand = useBrand();
  const { tokens } = useTheme();

  let bg: string = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;
  let color = tokens.text.onPrimary;
  let border = 'none';

  if (variant === 'secondary') {
    bg = tokens.surface.panel;
    color = tokens.text.primary;
    border = `1px solid ${tokens.border.standard}`;
  } else if (variant === 'danger') {
    bg = tokens.status.danger.border;
    color = tokens.text.onPrimary;
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = brand.semanticColorAliases?.brandPrimary || tokens.text.brand;
  }

  const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px';
  const fontSize = size === 'sm' ? '14px' : '16px';

  return (
    <button
      style={{
        backgroundColor: bg,
        color,
        border,
        padding,
        fontSize,
        fontFamily: brand.authorizedFontFamily || typography.fontFamily.fallback,
        borderRadius: '6px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const IconButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} style={{ padding: '8px', borderRadius: '50%', ...props.style }} />
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
        <label htmlFor={id} style={{ fontSize: '14px', fontWeight: 500, color: tokens.text.primary }}>
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${error ? tokens.status.danger.border : tokens.border.standard}`,
          fontSize: '14px',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: tokens.status.danger.text }}>{error}</span>}
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({
  label,
  children,
  id,
  ...props
}) => {
  const { tokens } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '14px', fontWeight: 500, color: tokens.text.primary }}>
          {label}
        </label>
      )}
      <select
        id={id}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${tokens.border.standard}`,
          fontSize: '14px',
          backgroundColor: tokens.surface.panel,
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
  const brand = useBrand();
  const { tokens } = useTheme();
  const brandColor = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
      <input id={id} type="checkbox" style={{ accentColor: brandColor }} {...props} />
      {label && <span>{label}</span>}
    </label>
  );
};

export const Card: React.FC<{ children: ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        backgroundColor: tokens.surface.panel,
        borderRadius: '8px',
        padding: '16px',
        boxShadow: elevation.officialShadow,
        border: `1px solid ${tokens.border.subtle}`,
        ...style,
      }}
    >
      {children}
    </div>
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
      {title && <strong style={{ display: 'block', marginBottom: '4px' }}>{title}</strong>}
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
      style={{ textAlign: 'center', padding: '32px 16px', backgroundColor: tokens.surface.panel, borderRadius: '8px' }}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: tokens.text.primary }}>{title}</h3>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: tokens.text.primary }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: tokens.text.secondary }}>{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
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
  const brandBg = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: tokens.surface.canvas }}
    >
      <header
        style={{
          height: '56px',
          backgroundColor: brandBg,
          color: tokens.text.onPrimary,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {brand.logoUrl && <img src={brand.logoUrl} alt={brand.displayName} style={{ height: '32px' }} />}
          <div style={{ fontWeight: 700, fontSize: '18px' }} data-testid="brand-name">
            {brand.displayName || brandName}
          </div>
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          <span data-testid="support-info">
            {brand.supportName} ({brand.supportEmail})
          </span>{' '}
          — {title}
        </div>
      </header>
      {navItems.length > 0 && (
        <nav
          style={{
            backgroundColor: tokens.surface.panel,
            borderBottom: `1px solid ${tokens.border.subtle}`,
            padding: '8px 24px',
            display: 'flex',
            gap: '16px',
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none', color: tokens.text.primary, fontSize: '14px', fontWeight: 500 }}
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
  const brand = useBrand();
  const { tokens } = useTheme();
  const brandColor = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `3px solid ${tokens.border.subtle}`,
        borderTop: `3px solid ${brandColor}`,
        borderRadius: '50%',
      }}
    />
  );
};
