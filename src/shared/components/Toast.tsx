// ══════════════════════════════════════════════════
// FILE: src/shared/components/Toast.tsx
// PURPOSE: Global animated toast notifications rendered at app root
// ══════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useToastStore } from '@shared/hooks/useToast';
import type { ToastMessage, ToastType } from '@shared/hooks/useToast';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from './Typography';
import { Spacing, BorderRadius } from '@theme/spacing';
import type { Theme } from '@theme/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const theme = useColorScheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Enter animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Exit animation
    const exitTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }, toast.duration);

    return () => clearTimeout(exitTimeout);
  }, [opacity, translateY, toast.duration]);

  const bgColor = getToastColor(toast.type, theme);

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: bgColor, opacity, transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity
        onPress={() => onDismiss(toast.id)}
        style={styles.toastInner}
        accessibilityRole="button"
        accessibilityLabel="Meldung schließen"
      >
        <Typography
          variant="subhead"
          color={theme.colors.white}
          style={styles.message}
        >
          {toast.message}
        </Typography>
      </TouchableOpacity>
    </Animated.View>
  );
};

function getToastColor(type: ToastType, theme: Theme): string {
  switch (type) {
    case 'success': return theme.colors.success;
    case 'error': return theme.colors.danger;
    case 'warning': return theme.colors.warning;
    case 'info': return theme.colors.primary;
  }
}

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const hideToast = useToastStore((s) => s.hideToast);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + Spacing.sm }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={hideToast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    gap: Spacing.sm,
  },
  toast: {
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  toastInner: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
  },
  message: {
    textAlign: 'center',
  },
});
