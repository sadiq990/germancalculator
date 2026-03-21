// ══════════════════════════════════════════════════
// FILE: src/shared/components/EmptyState.tsx
// PURPOSE: Empty list/screen state with illustration, title, and body text
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from './Typography';
import { Spacing } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '📋',
  title,
  body,
  action,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.emojiContainer}>
        <Typography variant="display" style={styles.emoji}>
          {emoji}
        </Typography>
      </View>
      <Typography variant="title3" style={styles.title}>
        {title}
      </Typography>
      {body !== undefined && (
        <Typography
          variant="body"
          color={theme.colors.gray600}
          style={styles.body}
        >
          {body}
        </Typography>
      )}
      {action !== undefined && <View style={styles.action}>{action}</View>}
    </View>
  );
};

function makeStyles(_theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xxl,
    },
    emojiContainer: {
      marginBottom: Spacing.lg,
      width: 72,
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 48,
    },
    title: {
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    body: {
      textAlign: 'center',
      lineHeight: 24,
    },
    action: {
      marginTop: Spacing.lg,
    },
  });
}
