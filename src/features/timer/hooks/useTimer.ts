// ══════════════════════════════════════════════════
// FILE: src/features/timer/hooks/useTimer.ts
// PURPOSE: Timer interval logic — drives elapsed seconds, handles app lifecycle
// ══════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTimerStore } from '@store/timerStore';
import { calcElapsedSeconds } from '@shared/utils/timeUtils';
import { shouldShowSmartStop } from '@shared/utils/validationUtils';
import { useSettingsStore } from '@store/settingsStore';

export interface UseTimerReturn {
  isRunning: boolean;
  elapsedSeconds: number;
  activeSession: ReturnType<typeof useTimerStore.getState>['activeSession'];
  isLoading: boolean;
  error: string | null;
  handleStart: () => Promise<void>;
  handleStop: () => Promise<void>;
  showSmartStop: boolean;
}

export function useTimer(): UseTimerReturn {
  const {
    isRunning,
    elapsedSeconds,
    activeSession,
    isLoading,
    error,
    startSession,
    stopSession,
    setElapsedSeconds,
  } = useTimerStore();

  const defaultShiftMinutes = useSettingsStore(
    (s) => s.settings.defaultShiftMinutes,
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>('active');
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);

  // Drive the ticker
  useEffect(() => {
    if (!isRunning || activeSession === null) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const elapsed = calcElapsedSeconds(activeSession.startTime);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activeSession, setElapsedSeconds]);

  // Restore elapsed time on app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (
          appStateRef.current === 'background' &&
          nextState === 'active' &&
          activeSession !== null
        ) {
          const elapsed = calcElapsedSeconds(activeSession.startTime);
          setElapsedSeconds(elapsed);
        }
        appStateRef.current = nextState;
      },
    );
    return () => subscription.remove();
  }, [activeSession, setElapsedSeconds]);

  // Debounced start with 500ms guard
  const handleStart = useCallback(async () => {
    if (isStartingRef.current || isRunning) return;
    isStartingRef.current = true;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await startSession();

    setTimeout(() => {
      isStartingRef.current = false;
    }, 500);
  }, [isRunning, startSession]);

  // Debounced stop with 500ms guard
  const handleStop = useCallback(async () => {
    if (isStoppingRef.current || !isRunning) return;
    isStoppingRef.current = true;

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await stopSession();

    setTimeout(() => {
      isStoppingRef.current = false;
    }, 500);
  }, [isRunning, stopSession]);

  const showSmartStop = shouldShowSmartStop(elapsedSeconds, defaultShiftMinutes);

  return {
    isRunning,
    elapsedSeconds,
    activeSession,
    isLoading,
    error,
    handleStart,
    handleStop,
    showSmartStop,
  };
}
