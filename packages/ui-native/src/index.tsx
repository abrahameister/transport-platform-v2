import React, { createContext, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ViewStyle } from 'react-native';
import { semanticTokens, SemanticTokens } from '@transport-platform/design-tokens';

const NativeThemeContext = createContext<{ tokens: SemanticTokens }>({
  tokens: semanticTokens,
});

export const NativeThemeProvider: React.FC<{
  tokens?: SemanticTokens;
  children: ReactNode;
}> = ({ tokens = semanticTokens, children }) => (
  <NativeThemeContext.Provider value={{ tokens }}>{children}</NativeThemeContext.Provider>
);

export const useNativeTheme = () => useContext(NativeThemeContext);

export interface NativeButtonProps {
  onPress?: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<NativeButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  let bg = semanticTokens.surface.brand;
  let textColor = semanticTokens.text.onPrimary;

  if (variant === 'secondary') {
    bg = semanticTokens.surface.panel;
    textColor = semanticTokens.text.primary;
  } else if (variant === 'danger') {
    bg = semanticTokens.status.danger.border;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.6 : 1 },
        variant === 'secondary' && styles.buttonSecondaryBorder,
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const TextField: React.FC<{
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}> = ({ label, value, onChangeText, placeholder }) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={semanticTokens.text.muted}
    />
  </View>
);

export const Card: React.FC<{ children: ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const Badge: React.FC<{
  label: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
}> = ({ label, variant = 'info' }) => {
  const statusToken = semanticTokens.status[variant];
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: statusToken.surface,
          borderColor: statusToken.border,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: statusToken.text }]}>{label}</Text>
    </View>
  );
};

export const Alert: React.FC<{
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
}> = ({ title, message, variant = 'info' }) => {
  const statusToken = semanticTokens.status[variant];
  return (
    <View
      style={[
        styles.alert,
        {
          backgroundColor: statusToken.surface,
          borderLeftColor: statusToken.border,
        },
      ]}
    >
      {title && <Text style={[styles.alertTitle, { color: statusToken.text }]}>{title}</Text>}
      <Text style={[styles.alertMessage, { color: statusToken.text }]}>{message}</Text>
    </View>
  );
};

export const Screen: React.FC<{ children: ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={[styles.screen, style]}>{children}</View>
);

export const Stack: React.FC<{
  children: ReactNode;
  gap?: number;
  style?: ViewStyle;
}> = ({ children, gap = 12, style }) => <View style={[{ gap }, style]}>{children}</View>;

export const EmptyState: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
  </View>
);

export const LoadingIndicator: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size={size} color={semanticTokens.surface.brand} />
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: semanticTokens.surface.canvas,
    padding: 16,
  },
  card: {
    backgroundColor: semanticTokens.surface.panel,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: semanticTokens.border.subtle,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryBorder: {
    borderWidth: 1,
    borderColor: semanticTokens.border.standard,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    gap: 4,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: semanticTokens.text.primary,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: semanticTokens.border.standard,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: semanticTokens.surface.panel,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alert: {
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  alertTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 13,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticTokens.text.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: semanticTokens.text.secondary,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
