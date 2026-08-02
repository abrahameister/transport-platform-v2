import React, { createContext, useContext, ReactNode } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { semanticTokens, SemanticTokens } from '@transport-platform/design-tokens';

export interface NativeTenantBrandConfig {
  displayName: string;
  shortName: string;
  logoUrl: string;
  supportName: string;
  supportEmail: string;
  semanticColorAliases?: {
    brandPrimary?: string;
  };
  authorizedFontFamily?: string;
}

export const defaultNativeBrandConfig: NativeTenantBrandConfig = {
  displayName: 'Transport Platform V2',
  shortName: 'TP-V2',
  logoUrl: 'https://placeholder.com/logo.png',
  supportName: 'Soporte Móvil',
  supportEmail: 'soporte@transportplatform.com',
  semanticColorAliases: {
    brandPrimary: semanticTokens.surface.brand,
  },
};

const NativeBrandContext = createContext<NativeTenantBrandConfig>(defaultNativeBrandConfig);
const NativeThemeContext = createContext<{ tokens: SemanticTokens }>({ tokens: semanticTokens });

export const NativeBrandProvider: React.FC<{ value?: NativeTenantBrandConfig; children: ReactNode }> = ({
  value = defaultNativeBrandConfig,
  children,
}) => <NativeBrandContext.Provider value={value}>{children}</NativeBrandContext.Provider>;

export const useNativeBrand = () => useContext(NativeBrandContext);

export const NativeThemeProvider: React.FC<{
  tokens?: SemanticTokens;
  brand?: NativeTenantBrandConfig;
  children: ReactNode;
}> = ({ tokens = semanticTokens, brand = defaultNativeBrandConfig, children }) => (
  <NativeBrandContext.Provider value={brand}>
    <NativeThemeContext.Provider value={{ tokens }}>{children}</NativeThemeContext.Provider>
  </NativeBrandContext.Provider>
);

export const useNativeTheme = () => useContext(NativeThemeContext);

// --- NATIVE COMPONENTS ---

export const Screen: React.FC<{ children: ReactNode; style?: object; testID?: string }> = ({
  children,
  style,
  testID,
}) => {
  const { tokens } = useNativeTheme();
  return (
    <View testID={testID} style={[{ flex: 1, backgroundColor: tokens.surface.canvas, padding: 16 }, style]}>
      {children}
    </View>
  );
};

export const Stack: React.FC<{ children: ReactNode; gap?: number; style?: object }> = ({
  children,
  gap = 12,
  style,
}) => <View style={[{ flexDirection: 'column', gap }, style]}>{children}</View>;

export const Card: React.FC<{ children: ReactNode; style?: object; testID?: string }> = ({
  children,
  style,
  testID,
}) => {
  const { tokens } = useNativeTheme();
  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: tokens.surface.panel,
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          shadowColor: '#1C3B57',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const Button: React.FC<{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'brand';
  style?: object;
  testID?: string;
  disabled?: boolean;
}> = ({ title, onPress, variant = 'primary', style, testID, disabled = false }) => {
  const brand = useNativeBrand();
  const { tokens } = useNativeTheme();

  // Duet Solutions Driver Mode: Primary buttons use tactile Orange CTA (#E8832A) for immediate recognition in motion
  let bg = tokens.surface.cta || '#E8832A';
  let textColor = tokens.text.onPrimary;
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (variant === 'brand') {
    bg = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;
    textColor = tokens.text.onPrimary;
  } else if (variant === 'secondary') {
    bg = tokens.surface.panel;
    textColor = tokens.text.primary;
    borderWidth = 1;
    borderColor = tokens.border.standard;
  } else if (variant === 'danger') {
    bg = tokens.status.danger.border;
    textColor = tokens.text.onPrimary;
  }

  if (disabled) {
    bg = tokens.interaction.disabled || '#94A3B8';
    textColor = '#FFFFFF';
  }

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: bg,
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth,
          borderColor,
          minHeight: 48, // High touch target for Driver app
        },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export const TextField: React.FC<{
  label?: string;
  value?: string;
  onChangeText?: (_text: string) => void;
  placeholder?: string;
  error?: string;
  testID?: string;
  secureTextEntry?: boolean;
}> = ({ label, value, onChangeText, placeholder, error, testID, secureTextEntry = false }) => {
  const { tokens } = useNativeTheme();
  return (
    <View style={{ gap: 6, width: '100%' }}>
      {label && <Text style={{ fontSize: 14, fontWeight: '600', color: tokens.text.primary }}>{label}</Text>}
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.text.muted}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: error ? tokens.status.danger.border : tokens.border.standard,
          borderRadius: 6,
          paddingHorizontal: 14,
          paddingVertical: 12,
          minHeight: 46,
          backgroundColor: tokens.surface.panel,
          color: tokens.text.primary,
          fontSize: 15,
        }}
      />
      {error && <Text style={{ fontSize: 12, color: tokens.status.danger.text, fontWeight: '500' }}>{error}</Text>}
    </View>
  );
};

export const Badge: React.FC<{
  variant?: 'info' | 'success' | 'warning' | 'danger';
  label: string;
  testID?: string;
}> = ({ variant = 'info', label, testID }) => {
  const { tokens } = useNativeTheme();
  const statusToken = tokens.status[variant];
  return (
    <View
      testID={testID}
      style={{
        backgroundColor: statusToken.surface,
        borderColor: statusToken.border,
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: statusToken.text, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
};

export const Alert: React.FC<{
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  message: string;
  testID?: string;
}> = ({ variant = 'info', title, message, testID }) => {
  const { tokens } = useNativeTheme();
  const statusToken = tokens.status[variant];
  return (
    <View
      testID={testID}
      style={{
        backgroundColor: statusToken.surface,
        borderLeftWidth: 4,
        borderLeftColor: statusToken.border,
        padding: 14,
        borderRadius: 4,
        gap: 4,
      }}
    >
      {title && <Text style={{ color: statusToken.text, fontWeight: '700', fontSize: 15 }}>{title}</Text>}
      <Text style={{ color: statusToken.text, fontSize: 14, lineHeight: 20 }}>{message}</Text>
    </View>
  );
};

export const EmptyState: React.FC<{ title: string; description?: string }> = ({ title, description }) => {
  const { tokens } = useNativeTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        padding: 32,
        backgroundColor: tokens.surface.panel,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
      }}
    >
      <Text
        style={{
          fontSize: 17,
          fontWeight: '700',
          color: tokens.text.brand || tokens.text.primary,
          marginBottom: 6,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {description && (
        <Text style={{ fontSize: 14, color: tokens.text.secondary, textAlign: 'center', lineHeight: 20 }}>
          {description}
        </Text>
      )}
    </View>
  );
};

export const LoadingIndicator: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'small' }) => {
  const { tokens } = useNativeTheme();
  const indicatorColor = tokens.surface.cta || '#E8832A';
  return <ActivityIndicator size={size} color={indicatorColor} />;
};
