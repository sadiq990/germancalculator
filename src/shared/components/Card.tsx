// ══════════════════════════════════════════════════
// FILE: src/shared/components/Card.tsx
// PURPOSE: Surface card component used for session items, stats, settings rows
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { BorderRadius, Spacing } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface CardProps {
  children: React.ReactNode;
  accentColor?: string;
  style?: object;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  accentColor,
  style,
  noPadding = false,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.card, style]}>
      {accentColor !== undefined && (
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
      )}
      <View style={[styles.content, noPadding && styles.noPadding, accentColor !== undefined && styles.contentWithAccent]}>
        {children}
      </View>
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.gray100,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      overflow: 'hidden',
      flexDirection: 'row',
    },
    accent: {
      width: 4,
    },
    content: {
      flex: 1,
      padding: Spacing.md,
    },
    contentWithAccent: {
      paddingLeft: Spacing.md,
    },
    noPadding: {
      padding: 0,
    },
  });
}
