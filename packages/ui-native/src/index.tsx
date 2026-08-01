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
  variant?: 'primary' | 'secondary' | 'danger';
  style?: object;
  testID?: string;
}> = ({ title, onPress, variant = 'primary', style, testID }) => {
  const brand = useNativeBrand();
  const { tokens } = useNativeTheme();

  let bg = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;
  let textColor = tokens.text.onPrimary;

  if (variant === 'secondary') {
    bg = tokens.surface.panel;
    textColor = tokens.text.primary;
  } else if (variant === 'danger') {
    bg = tokens.status.danger.border;
    textColor = tokens.text.onPrimary;
  }

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[
        {
          backgroundColor: bg,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontWeight: '600', fontSize: 16 }}>{title}</Text>
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
}> = ({ label, value, onChangeText, placeholder, error, testID }) => {
  const { tokens } = useNativeTheme();
  return (
    <View style={{ gap: 4, width: '100%' }}>
      {label && <Text style={{ fontSize: 14, fontWeight: '500', color: tokens.text.primary }}>{label}</Text>}
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.text.muted}
        style={{
          borderWidth: 1,
          borderColor: error ? tokens.status.danger.border : tokens.border.standard,
          borderRadius: 6,
          padding: 10,
          backgroundColor: tokens.surface.panel,
          color: tokens.text.primary,
        }}
      />
      {error && <Text style={{ fontSize: 12, color: tokens.status.danger.text }}>{error}</Text>}
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
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: statusToken.text, fontSize: 12, fontWeight: '600' }}>{label}</Text>
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
        padding: 12,
        borderRadius: 4,
        gap: 4,
      }}
    >
      {title && <Text style={{ color: statusToken.text, fontWeight: '700', fontSize: 14 }}>{title}</Text>}
      <Text style={{ color: statusToken.text, fontSize: 14 }}>{message}</Text>
    </View>
  );
};

export const EmptyState: React.FC<{ title: string; description?: string }> = ({ title, description }) => {
  const { tokens } = useNativeTheme();
  return (
    <View style={{ alignItems: 'center', padding: 24, backgroundColor: tokens.surface.panel, borderRadius: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: tokens.text.primary, marginBottom: 8 }}>{title}</Text>
      {description && <Text style={{ fontSize: 14, color: tokens.text.secondary }}>{description}</Text>}
    </View>
  );
};

export const LoadingIndicator: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'small' }) => {
  const brand = useNativeBrand();
  const { tokens } = useNativeTheme();
  const brandColor = brand.semanticColorAliases?.brandPrimary || tokens.surface.brand;
  return <ActivityIndicator size={size} color={brandColor} />;
};
