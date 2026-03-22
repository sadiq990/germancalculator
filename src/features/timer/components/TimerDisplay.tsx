// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/TimerDisplay.tsx
// PURPOSE: Large HH:MM:SS timer display with digit tick animation
// ══════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const timeStr = formatElapsedTime(elapsedSeconds);

  // Digit tick animation — subtle upward bounce on each second change
  const digitAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isRunning || elapsedSeconds === 0) return;
    Animated.sequence([
      Animated.timing(digitAnim, {
        toValue: -4,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(digitAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [elapsedSeconds, isRunning, digitAnim]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.timerGlow }]}
      accessibilityRole="text"
      accessibilityLabel={t('accessibility.timer_display', { time: timeStr })}
    >
      <Animated.View style={{ transform: [{ translateY: digitAnim }] }}>
        <Typography
          variant="display"
          style={[
            styles.time,
            { color: isRunning ? theme.colors.danger : theme.colors.gray900 },
          ]}
        >
          {timeStr}
        </Typography>
      </Animated.View>
      {isRunning && (
        <Typography
          variant="footnote"
          color={theme.colors.gray400}
          style={styles.label}
        >
          {t('home.session_running')}
        </Typography>
      )}
    </View>
  );
};

// ✓ SELF-TEST: TimerDisplay
// □ formatElapsedTime renders HH:MM:SS correctly?
// □ Digit tick animation bounces translateY -4→0 on each second?
// □ Animation only fires when isRunning=true and elapsedSeconds > 0?
// □ isRunning=true → danger color for time text?
// □ isRunning=false → gray900 color for time text?
// □ "Schicht läuft" label uses t('home.session_running') — not hardcoded?
// □ timerGlow background tint applied?

function makeStyles(_theme: Theme) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: Spacing.xxl,
      borderRadius: 12,
      marginBottom: Spacing.md,
    },
    time: {
      fontVariant: ['tabular-nums'],
      fontSize: 56,
      fontWeight: '700',
      lineHeight: 56 * 1.1,
      letterSpacing: 4,
    },
    label: {
      marginTop: Spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  });
}
