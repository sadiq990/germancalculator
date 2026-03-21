// ══════════════════════════════════════════════════
// FILE: src/shared/components/Button.tsx
// PURPOSE: Reusable button component — implements Sachlichkeit design spec
// ══════════════════════════════════════════════════

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography as Typo } from './Typography';
import { BorderRadius, Spacing } from '@theme/spacing';
import type { Theme } from '@theme/index';

export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  icon,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [disabled, loading, onPress]);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' || variant === 'secondary'
            ? theme.colors.primary
            : theme.colors.white}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon !== undefined && <View style={styles.icon}>{icon}</View>}
          <Typo
            variant="headline"
            style={[
              styles.label,
              styles[`label_${variant}`],
              isDisabled && styles.labelDisabled,
            ]}
          >
            {label}
          </Typo>
        </View>
      )}
    </TouchableOpacity>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.sm,
      minHeight: theme.layout.minTouchTarget,
    },
    fullWidth: { width: '100%' },
    disabled: { opacity: 0.5 },
    content: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    icon: { marginRight: Spacing.xs },
    label: { textAlign: 'center' },

    // Variants
    variant_primary: { backgroundColor: theme.colors.primary },
    variant_danger: { backgroundColor: theme.colors.danger },
    variant_ghost: {
      backgroundColor: theme.colors.transparent,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    variant_secondary: {
      backgroundColor: theme.colors.gray100,
    },

    // Label colors
    label_primary: { color: theme.colors.white },
    label_danger: { color: theme.colors.white },
    label_ghost: { color: theme.colors.primary },
    label_secondary: { color: theme.colors.gray800 },
    labelDisabled: {},

    // Sizes
    size_sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
    size_md: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
    size_lg: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  });
}
