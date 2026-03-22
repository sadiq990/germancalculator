// ══════════════════════════════════════════════════
// FILE: src/features/timer/screens/HomeScreen.tsx
// PURPOSE: Main timer screen — orchestrates all timer feature components
// ══════════════════════════════════════════════════

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ManualEntrySheet } from '../components/ManualEntrySheet';
import { EditSessionSheet } from '../components/EditSessionSheet';
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
  const { t } = useTranslation();

  const {
    isRunning,
    isPaused,
    elapsedSeconds,
    isLoading,
    error,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
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
  
  const [isManualSheetVisible, setIsManualSheetVisible] = useState(false);
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<WorkSession | null>(null);

  // Load sessions on mount
  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  // Check for restored session on mount
  useEffect(() => {
    void (async () => {
      if (activeSession !== null) return; // Already running

      const restored = await restoreActiveSession();
      if (restored) {
        const currentSession = useTimerStore.getState().activeSession;
        if (currentSession !== null) {
          // Check for corruption
          if (isSessionCorrupted(currentSession.startTime)) {
            Alert.alert(
              t('home.clock_warning_title'),
              t('home.clock_warning_message'),
              [
                { text: t('home.restore_no'), onPress: () => void discardActiveSession() },
                { text: t('home.restore_yes'), style: 'cancel' },
              ],
            );
          } else {
            Alert.alert(
              t('home.restore_session_title'),
              t('home.restore_session_message'),
              [
                {
                  text: t('home.restore_no'),
                  style: 'destructive',
                  onPress: () => void discardActiveSession(),
                },
                { text: t('home.restore_yes'), style: 'cancel' },
              ],
            );
          }
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
      toast.success(t('home.session_deleted'));
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
            onEdit={(s) => {
              setEditingSession(s);
              setIsEditSheetVisible(true);
            }}
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
              <View style={styles.titleGroup}>
                <Typography variant="title1">{t('home.title')}</Typography>
                <TouchableOpacity
                  style={[styles.proTag, { backgroundColor: theme.colors.primaryLight }]}
                  accessibilityLabel="Informationen zu Pro"
                >
                  <Typography variant="caption2" color={theme.colors.primary}>
                    {settings.isPro ? t('common.pro') + ' ✓' : t('common.free')}
                  </Typography>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setIsManualSheetVisible(true)} /* ✓ WIRED */ accessibilityLabel={t('manual_entry.title')}>
                <Typography variant="title1" color={theme.colors.primary}>+</Typography>
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
              isPaused={isPaused}
              isLoading={isLoading || false}
              onStart={() => void handleStart()}
              onStop={() => void handleStop()}
              onPause={() => void handlePause()}
              onResume={() => void handleResume()}
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
                {t('home.sessions_header').toUpperCase()}
              </Typography>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="⏱"
            title={t('home.no_sessions_today')}
            body={t('onboarding.step1_body')}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <ManualEntrySheet
        visible={isManualSheetVisible}
        onClose={() => setIsManualSheetVisible(false)}
      />

      <EditSessionSheet
        session={editingSession}
        visible={isEditSheetVisible}
        onClose={() => {
          setIsEditSheetVisible(false);
          setEditingSession(null);
        }}
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
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.xl,
    },
    titleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
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
