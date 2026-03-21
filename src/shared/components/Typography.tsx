// ══════════════════════════════════════════════════
// FILE: src/shared/components/Typography.tsx
// PURPOSE: Text component with semantic variants from the type scale
// ══════════════════════════════════════════════════

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import type { TextStyle } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography as TypoScale } from '@theme/typography';
import type { TypographyKey } from '@theme/typography';
import type { Theme } from '@theme/index';

interface TypographyProps {
  variant?: TypographyKey;
  color?: string;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
  accessibilityRole?: 'header' | 'text';
  selectable?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  children,
  style,
  numberOfLines,
  accessibilityRole,
  selectable = false,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  const textColor = color ?? (variant === 'display' || variant === 'title1' || variant === 'title2' || variant === 'title3' || variant === 'headline'
    ? theme.colors.gray900
    : theme.colors.gray800);

  return (
    <Text
      style={[TypoScale[variant], { color: textColor }, styles.base, style]}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole}
      selectable={selectable}
    >
      {children}
    </Text>
  );
};

function makeStyles(_theme: Theme) {
  return StyleSheet.create({
    base: {
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
  });
}
