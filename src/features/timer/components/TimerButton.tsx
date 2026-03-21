// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/TimerButton.tsx
// PURPOSE: The primary START/STOP button with pulse animation and haptics
// ══════════════════════════════════════════════════

import React, { useEffect, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { BorderRadius, Layout } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface TimerButtonProps {
  isRunning: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const TimerButton: React.FC<TimerButtonProps> = ({
  isRunning,
  isLoading,
  onStart,
  onStop,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRunning) {
      pulseAnim.setValue(1);
      pulseOpacity.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.9,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [isRunning, pulseAnim, pulseOpacity]);

  const handlePress = useCallback(() => {
    if (isLoading) return;
    if (isRunning) {
      onStop();
    } else {
      onStart();
    }
  }, [isLoading, isRunning, onStart, onStop]);

  const backgroundColor = isLoading
    ? theme.colors.gray400
    : isRunning
      ? theme.colors.danger
      : theme.colors.primary;

  const label = isLoading ? '...' : isRunning ? 'STOPPEN' : 'STARTEN';
  const icon = isRunning ? '⏹' : '▶';

  const a11yLabel = isRunning ? 'Schicht stoppen' : 'Schicht starten';
  const a11yHint = isRunning
    ? 'Beendet die aktuelle Schicht und speichert die Zeit'
    : 'Startet eine neue Schicht';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale: pulseAnim }],
          opacity: pulseOpacity,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        style={[styles.button, { backgroundColor }]}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint={a11yHint}
        accessibilityState={{ disabled: isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.white} size="small" />
        ) : (
          <View style={styles.content}>
            <Typography variant="headline" color={theme.colors.white}>
              {icon}{'  '}{label}
            </Typography>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    button: {
      height: Layout.timerButtonHeight,
      borderRadius: BorderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
}
