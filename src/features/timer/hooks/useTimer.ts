// ══════════════════════════════════════════════════
// FILE: src/features/timer/hooks/useTimer.ts
// PURPOSE: Timer interval logic — drives elapsed seconds, handles app lifecycle
// ══════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTimerStore } from '@store/timerStore';
import { shouldShowSmartStop } from '@shared/utils/validationUtils';
import { useSettingsStore } from '@store/settingsStore';

export interface UseTimerReturn {
  isRunning: boolean;
  elapsedSeconds: number;
  activeSession: ReturnType<typeof useTimerStore.getState>['activeSession'];
  isLoading: boolean;
  error: string | null;
  isPaused: boolean;
  handleStart: () => Promise<void>;
  handleStop: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleResume: () => Promise<void>;
  showSmartStop: boolean;
}

export function useTimer(): UseTimerReturn {
  const {
    isRunning,
    timerPhase,
    elapsedSeconds,
    activeSession,
    isLoading,
    error,
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
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
    if (timerPhase !== 'running' || activeSession === null) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - activeSession.startTime - activeSession.totalPausedMs) / 1000
      );
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => {
      // ✓ cleanup logic
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerPhase, activeSession, setElapsedSeconds]);

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
          const isPaused = activeSession.pausedAt !== null;
          const currentPauseDuration = isPaused ? Date.now() - activeSession.pausedAt! : 0;
          const elapsed = Math.floor(
            (Date.now() - activeSession.startTime - activeSession.totalPausedMs - currentPauseDuration) / 1000
          );
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

  const handlePause = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await pauseSession();
  }, [pauseSession]);

  const handleResume = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await resumeSession();
  }, [resumeSession]);

  const showSmartStop = shouldShowSmartStop(elapsedSeconds, defaultShiftMinutes);

  return {
    isRunning,
    isPaused: timerPhase === 'paused',
    elapsedSeconds,
    activeSession,
    isLoading,
    error,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
    showSmartStop,
  };
}
