// ══════════════════════════════════════════════════
// FILE: src/shared/components/ScreenWrapper.tsx
// PURPOSE: Screen layout wrapper with safe area, background color, and optional header
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import type { Theme } from '@theme/index';
import { Spacing } from '@theme/spacing';

interface ScreenWrapperProps {
  children: React.ReactNode;
  noPadding?: boolean;
  style?: object;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  noPadding = false,
  style,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={[styles.safe]} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.isDark ? theme.colors.gray900 : theme.colors.gray50}
      />
      <View style={[styles.container, !noPadding && styles.padding, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.isDark ? '#0F0F0F' : theme.colors.gray50,
    },
    container: {
      flex: 1,
    },
    padding: {
      paddingHorizontal: Spacing.md,
    },
  });
}
