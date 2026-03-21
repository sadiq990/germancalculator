// ══════════════════════════════════════════════════
// FILE: App.tsx
// PURPOSE: App entry point — initializes i18n, stores, notifications, and renders root navigator
// ══════════════════════════════════════════════════

import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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

function AppLoader() {
  const [ready, setReady] = useState(false);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadSessions = useTimerStore((s) => s.loadSessions);

  const bootstrap = useCallback(async () => {
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
              navigationRef.navigate('Home');
            }
          }
        },
      );

      // Cleanup is handled below
      return () => notificationService.removeSubscription(subscription);
    } catch {
      // Even on bootstrap failure, render the app (graceful degradation)
    } finally {
      setReady(true);
    }
  }, [loadSettings, loadSessions]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    void bootstrap().then((fn) => {
      cleanup = fn;
    });
    return () => cleanup?.();
  }, [bootstrap]);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <RootNavigator />
      <ToastContainer />
    </>
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
});
