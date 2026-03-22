// ══════════════════════════════════════════════════
// FILE: App.tsx
// PURPOSE: App entry point — splash animation, i18n, stores, notifications, onboarding
// ══════════════════════════════════════════════════

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { initI18n } from './src/locales/i18n';
import { RootNavigator, navigationRef } from './src/navigation/RootNavigator';
import { ToastContainer } from './src/shared/components/Toast';
import { useSettingsStore } from './src/store/settingsStore';
import { useTimerStore } from './src/store/timerStore';
import { notificationService } from './src/core/services/notificationService';
import { Colors } from './src/theme/colors';
import { Typography } from './src/shared/components/Typography';

function AppLoader() {
  const [ready, setReady] = useState(false);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadSessions = useTimerStore((s) => s.loadSessions);

  // Splash animation values
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const splashScale = useRef(new Animated.Value(0.85)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const bootstrap = useCallback(async (): Promise<(() => void) | undefined> => {
    try {
      // 1. Initialize i18n (reads stored locale from AsyncStorage)
      await initI18n();

      // 2. Load settings and sessions in parallel
      await Promise.all([loadSettings(), loadSessions()]);

      // 3. Register notification response handler
      const subscription = notificationService.addNotificationResponseListener(
        (response) => {
          const data = response.notification.request.content.data as
            | Record<string, unknown>
            | undefined;
          if (data?.['action'] === 'open_timer') {
            if (navigationRef.isReady()) {
              navigationRef.navigate('MainTabs');
            }
          }
        },
      );

      return () => notificationService.removeSubscription(subscription);
    } catch {
      // Even on bootstrap failure, render the app (graceful degradation)
      return undefined;
    } finally {
      setReady(true);
    }
  }, [loadSettings, loadSessions]);

  useEffect(() => {
    // Start splash animation immediately
    Animated.parallel([
      Animated.timing(splashOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(splashScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    let cleanup: (() => void) | undefined;
    void bootstrap().then((fn) => {
      cleanup = fn;
      // Fade in main content after bootstrap
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    return () => cleanup?.();
  }, [bootstrap, splashOpacity, splashScale, contentOpacity]);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <Animated.View
          style={{
            opacity: splashOpacity,
            transform: [{ scale: splashScale }],
            alignItems: 'center',
          }}
        >
          <View style={styles.splashIcon}>
            <Typography variant="display" style={styles.splashEmoji}>
              ⏱
            </Typography>
          </View>
          <Typography
            variant="title1"
            color={Colors.white}
            style={styles.splashTitle}
          >
            Stundenrechner Pro
          </Typography>
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.root, { opacity: contentOpacity }]}>
      <RootNavigator />
      <ToastContainer />
    </Animated.View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppLoader />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splash: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  splashEmoji: {
    fontSize: 40,
  },
  splashTitle: {
    letterSpacing: 1,
  },
});
