// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/TimerDisplay.tsx
// PURPOSE: Large HH:MM:SS timer display with display-size typography
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { formatElapsedTime } from '@shared/utils/timeUtils';
import { Spacing } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface TimerDisplayProps {
  elapsedSeconds: number;
  isRunning: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsedSeconds,
  isRunning,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const timeStr = formatElapsedTime(elapsedSeconds);

  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={`Vergangene Zeit: ${timeStr}`}
    >
      <Typography
        variant="display"
        style={[
          styles.time,
          { color: isRunning ? theme.colors.danger : theme.colors.gray900 },
        ]}
      >
        {timeStr}
      </Typography>
      {isRunning && (
        <Typography
          variant="footnote"
          color={theme.colors.gray400}
          style={styles.label}
        >
          Schicht läuft
        </Typography>
      )}
    </View>
  );
};

function makeStyles(_theme: Theme) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: Spacing.xxl,
    },
    time: {
      fontVariant: ['tabular-nums'],
      fontSize: 56,
      fontWeight: '700',
      lineHeight: 56 * 1.1,
    },
    label: {
      marginTop: Spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  });
}
