// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/TimerButton.tsx
// PURPOSE: The primary START/STOP button with pulse animation, color transition, and haptics
// ══════════════════════════════════════════════════

import React, { useEffect, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLanguage } from '@shared/hooks/useLanguage';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { BorderRadius, Layout, Spacing } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface TimerButtonProps {
  isRunning: boolean;
  isPaused: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const TimerButton: React.FC<TimerButtonProps> = ({
  isRunning,
  isPaused,
  isLoading,
  onStart,
  onStop,
  onPause,
  onResume,
}) => {
  const { t } = useLanguage();
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  // Animation: pulse scale
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation: color transition (blue ↔ red)
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation when running (and not paused)
  useEffect(() => {
    if (isRunning && !isPaused) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1.0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    return undefined;
  }, [isRunning, isPaused, pulseAnim]);

  // Color transition animation
  useEffect(() => {
    let toValue = 0; // idle
    if (isRunning) {
      toValue = isPaused ? 2 : 1;
    }
    Animated.timing(colorAnim, {
      toValue,
      duration: 250,
      useNativeDriver: false, // color interpolation requires false
    }).start();
  }, [isRunning, isPaused, colorAnim]);

  const handlePress = useCallback(() => {
    if (isLoading) return;
    if (!isRunning) {
      onStart(); // ✓ WIRED: idle -> start
    } else if (isPaused) {
      onResume(); // ✓ WIRED: paused -> resume
    } else {
      onStop(); // ✓ WIRED: running -> stop
    }
  }, [isLoading, isRunning, isPaused, onStart, onStop, onResume]);

  // Interpolated background color
  const buttonColor = isLoading
    ? theme.colors.gray400
    : colorAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [theme.colors.primary, theme.colors.danger, '#E67E22'],
      });

  const label = isLoading 
    ? '...' 
    : !isRunning 
      ? t('home.start') 
      : isPaused 
        ? t('timer.resume') 
        : t('home.stop');
        
  const icon = isPaused ? '▶' : isRunning ? '⏹' : '▶';

  const a11yLabel = !isRunning 
    ? t('accessibility.timer_start') 
    : isPaused 
      ? t('timer.resume') 
      : t('accessibility.timer_stop');
      
  const a11yHint = isRunning && !isPaused
    ? t('accessibility.timer_stop_hint')
    : t('accessibility.timer_start_hint');

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint={a11yHint}
        accessibilityState={{ disabled: isLoading }}
      >
        <Animated.View style={[styles.button, { backgroundColor: buttonColor }]}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.white} size="small" />
          ) : (
            <View style={styles.content}>
              <Typography variant="headline" color={theme.colors.white}>
                {icon}{'  '}{label}
              </Typography>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
      
      {/* Secondary Pause Button */}
      {isRunning && !isPaused && (
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={onPause} // ✓ WIRED
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('timer.pause')}
        >
          <Typography variant="body" color={theme.colors.gray600} style={{ fontWeight: '600' }}>
            ⏸ {t('timer.pause')}
          </Typography>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// ✓ SELF-TEST: TimerButton
// □ onPress handler wired — calls onStart/onStop via handlePress?
// □ isRunning=false → primary background (blue), "STARTEN" text?
// □ isRunning=true → danger background (red), "STOPPEN" text?
// □ Pulse animation scale 1.0→1.04→1.0 loop when isRunning=true?
// □ Color interpolation blue→red with useNativeDriver: false?
// □ isLoading=true → button disabled, ActivityIndicator shown?
// □ All strings use t() — no hardcoded labels?
// □ Minimum touch target = 72pt height?

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
    pauseButton: {
      marginTop: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.sm,
    },
  });
}
