// ══════════════════════════════════════════════════
// FILE: src/features/timer/screens/HomeScreen.tsx
// PURPOSE: Main timer screen — orchestrates all timer feature components
// ══════════════════════════════════════════════════

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Typography } from '@shared/components/Typography';
import { EmptyState } from '@shared/components/EmptyState';
import { TimerButton } from '../components/TimerButton';
import { TimerDisplay } from '../components/TimerDisplay';
import { DailyStats } from '../components/DailyStats';
import { SessionCard } from '../components/SessionCard';
import { OnboardingTip } from '../components/OnboardingTip';
import { useTimer } from '../hooks/useTimer';
import { useTimerStore } from '@store/timerStore';
import { useSettingsStore } from '@store/settingsStore';
import { useToast } from '@shared/hooks/useToast';
import { groupSessionsByDay } from '@shared/utils/dateUtils';
import { checkLegalWarnings } from '@shared/utils/validationUtils';
import { isSessionCorrupted } from '@shared/utils/validationUtils';
import type { SessionGroup } from '@shared/utils/dateUtils';
import type { WorkSession } from '@core/types/models';
import { Spacing } from '@theme/spacing';
import type { Theme } from '@theme/index';

export const HomeScreen: React.FC = () => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const toast = useToast();

  const {
    isRunning,
    elapsedSeconds,
    isLoading,
    error,
    handleStart,
    handleStop,
    showSmartStop,
    activeSession,
  } = useTimer();

  const {
    sessions,
    loadSessions,
    deleteSession,
    updateSessionNote,
    restoreActiveSession,
    discardActiveSession,
    getTodayTotalMinutes,
    getMonthTotalMinutes,
    clearError,
  } = useTimerStore();

  const {
    settings,
    updateSettings,
    employers,
    getDefaultEmployer,
    getEmployerById,
  } = useSettingsStore();

  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());
  const [showOnboarding, setShowOnboarding] = useState(!settings.onboardingCompleted);

  // Load sessions on mount
  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  // Check for restored session on mount
  useEffect(() => {
    void (async () => {
      if (activeSession !== null) return; // Already running

      const restored = await restoreActiveSession();
      if (restored && activeSession !== null) {
        // Check for corruption
        if (isSessionCorrupted(activeSession.startTime)) {
          Alert.alert(
            'Zeitwarnung',
            'Die Schichtdauer scheint ungewöhnlich lang zu sein. Bitte überprüfe die Start- und Endzeit.',
            [
              { text: 'Schicht verwerfen', onPress: () => void discardActiveSession() },
              { text: 'Fortsetzen', style: 'cancel' },
            ],
          );
        } else {
          Alert.alert(
            'Läufst du noch?',
            'Es scheint, als hättest du eine laufende Schicht. Möchtest du sie fortsetzen?',
            [
              {
                text: 'Nein, verwerfen',
                style: 'destructive',
                onPress: () => void discardActiveSession(),
              },
              { text: 'Ja, fortsetzen', style: 'cancel' },
            ],
          );
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show error toast
  useEffect(() => {
    if (error !== null) {
      toast.error(error);
      clearError();
    }
  }, [error, toast, clearError]);

  // Show smart stop banner as toast
  useEffect(() => {
    if (showSmartStop && isRunning) {
      toast.warning('Bereit zum Stoppen? Du arbeitest schon lange.', 6000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSmartStop]);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    void updateSettings({ onboardingCompleted: true });
  }, [updateSettings]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteSession(id);
      toast.success('Schicht gelöscht');
    },
    [deleteSession, toast],
  );

  const handleDismissWarning = useCallback((type: string) => {
    setDismissedWarnings((prev) => new Set([...prev, type]));
  }, []);

  const todayMinutes = getTodayTotalMinutes();
  const now = new Date();
  const monthMinutes = getMonthTotalMinutes(now.getMonth() + 1, now.getFullYear());

  // Weekly total — simplified: last 7 days
  const weeklyMinutes = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return sessions
      .filter((s) => s.startTime >= sevenDaysAgo && s.durationMinutes !== null && s.endTime !== null)
      .reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0);
  }, [sessions]);

  const warnings = useMemo(() => {
    return checkLegalWarnings(todayMinutes, weeklyMinutes, monthMinutes).filter(
      (w) => !dismissedWarnings.has(w.type),
    );
  }, [todayMinutes, weeklyMinutes, monthMinutes, dismissedWarnings]);

  const sessionGroups = useMemo(() => groupSessionsByDay(sessions), [sessions]);

  const defaultEmployer = getDefaultEmployer();

  const renderSessionGroup = useCallback(
    ({ item }: { item: SessionGroup }) => (
      <View style={styles.group}>
        <Typography
          variant="footnote"
          color={theme.colors.gray600}
          style={styles.groupHeader}
        >
          {item.label.toUpperCase()}
        </Typography>
        {item.sessions.map((session: WorkSession) => (
          <SessionCard
            key={session.id}
            session={session}
            employer={session.employerId !== null ? (getEmployerById(session.employerId) ?? undefined) : undefined}
            onDelete={(id) => void handleDelete(id)}
            onUpdateNote={(id, note) => void updateSessionNote(id, note)}
          />
        ))}
      </View>
    ),
    [theme, styles, getEmployerById, handleDelete, updateSessionNote],
  );

  return (
    <ScreenWrapper>
      <FlatList
        data={sessionGroups}
        keyExtractor={(item: SessionGroup) => item.dateKey}
        renderItem={renderSessionGroup}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Screen title */}
            <View style={styles.titleRow}>
              <Typography variant="title1">Stunden</Typography>
              <TouchableOpacity
                style={[styles.proTag, { backgroundColor: theme.colors.primaryLight }]}
                accessibilityLabel="Informationen zu Pro"
              >
                <Typography variant="caption2" color={theme.colors.primary}>
                  {settings.isPro ? '✓ Pro' : 'Kostenlos'}
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Onboarding */}
            {showOnboarding && (
              <OnboardingTip onComplete={handleOnboardingComplete} />
            )}

            {/* Timer display */}
            <TimerDisplay
              elapsedSeconds={elapsedSeconds}
              isRunning={isRunning}
            />

            {/* Start/Stop button */}
            <TimerButton
              isRunning={isRunning}
              isLoading={isLoading || false}
              onStart={() => void handleStart()}
              onStop={() => void handleStop()}
            />

            {/* Daily stats + warnings */}
            <View style={styles.statsSection}>
              <DailyStats
                todayMinutes={todayMinutes}
                warnings={warnings}
                onDismissWarning={handleDismissWarning}
              />
            </View>

            {/* Sessions section header */}
            {sessions.length > 0 && (
              <Typography
                variant="caption1"
                color={theme.colors.gray600}
                style={styles.sessionsLabel}
              >
                SCHICHTEN
              </Typography>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="⏱"
            title="Noch keine Schichten"
            body="Tippe STARTEN, um deine erste Schicht zu erfassen."
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    header: {
      paddingTop: Spacing.md,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    proTag: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: 4,
    },
    statsSection: {
      marginTop: Spacing.md,
    },
    sessionsLabel: {
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
      letterSpacing: 1,
    },
    group: {
      marginBottom: Spacing.md,
    },
    groupHeader: {
      marginBottom: Spacing.sm,
      letterSpacing: 1,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: Spacing.xxl,
    },
  });
}
