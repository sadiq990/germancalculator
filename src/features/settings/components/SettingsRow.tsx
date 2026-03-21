// ══════════════════════════════════════════════════
// FILE: src/features/settings/components/SettingsRow.tsx
// PURPOSE: Generic settings row used throughout settings screen
// ══════════════════════════════════════════════════

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Spacing, Layout } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
  chevron?: boolean;
  disabled?: boolean;
  hint?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  value,
  onPress,
  toggle = false,
  toggleValue = false,
  onToggle,
  destructive = false,
  chevron = false,
  disabled = false,
  hint,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  const isInteractive = onPress !== undefined || toggle;

  const content = (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.left}>
        <Typography
          variant="body"
          color={destructive ? theme.colors.danger : theme.colors.gray800}
        >
          {label}
        </Typography>
        {hint !== undefined && (
          <Typography variant="caption1" color={theme.colors.gray400}>
            {hint}
          </Typography>
        )}
      </View>
      <View style={styles.right}>
        {value !== undefined && (
          <Typography variant="subhead" color={theme.colors.gray600}>
            {value}
          </Typography>
        )}
        {toggle && onToggle !== undefined && (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{
              false: theme.colors.gray200,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.white}
            disabled={disabled}
            accessibilityLabel={label}
          />
        )}
        {chevron && (
          <Typography variant="body" color={theme.colors.gray400}>
            ›
          </Typography>
        )}
      </View>
    </View>
  );

  if (isInteractive && !toggle) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={styles.touch}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touch}>{content}</View>;
};

export const SettingsDivider: React.FC = () => {
  const theme = useColorScheme();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.colors.gray200,
        marginLeft: Spacing.md,
      }}
    />
  );
};

export const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const theme = useColorScheme();
  return (
    <View style={{ marginBottom: Spacing.xl }}>
      <Typography
        variant="caption1"
        color={theme.colors.gray400}
        style={{
          marginBottom: Spacing.sm,
          marginLeft: Spacing.xs,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {title}
      </Typography>
      <View
        style={{
          backgroundColor: theme.colors.gray100,
          borderRadius: 8,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.gray200,
        }}
      >
        {children}
      </View>
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    touch: {
      minHeight: Layout.minTouchTarget,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      minHeight: Layout.minTouchTarget,
    },
    left: { flex: 1 },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginLeft: Spacing.md,
    },
    disabled: { opacity: 0.5 },
  });
}
