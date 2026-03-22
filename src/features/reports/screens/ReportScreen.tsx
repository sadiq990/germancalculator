// ══════════════════════════════════════════════════
// FILE: src/features/reports/screens/ReportScreen.tsx
// PURPOSE: Monthly report screen — month picker, charts, PDF export
// ══════════════════════════════════════════════════

import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Typography } from '@shared/components/Typography';
import { Button } from '@shared/components/Button';
import { EmptyState } from '@shared/components/EmptyState';
import { MonthPicker } from '../components/MonthPicker';
import { WeeklyChart } from '../components/WeeklyChart';
import { MonthlyStats } from '../components/MonthlyStats';
import { useReports } from '../hooks/useReports';
import { usePDF } from '../hooks/usePDF';
import { useSettingsStore } from '@store/settingsStore';
import { formatMonthYear } from '@shared/utils/dateUtils';
import { Spacing } from '@theme/spacing';
import type { Theme } from '@theme/index';

export const ReportScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const settings = useSettingsStore((s) => s.settings);

  const { filter, setFilter, report, weeklyBuckets, maxWeeklyMinutes } = useReports();
  const { isGenerating, generateAndShare } = usePDF();

  const handleExport = useCallback(async () => {
    if (report.sessions.length === 0) return;
    await generateAndShare(report.sessions, filter);
  }, [report.sessions, filter, generateAndShare]);

  const monthLabel = formatMonthYear(filter.month, filter.year, settings.locale);
  const canExport = report.sessions.length > 0 && !isGenerating;

  return (
    <ScreenWrapper noPadding>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Typography variant="title1">{t('reports.title')}</Typography>
        </View>

        {/* Month picker — sticky */}
        <View style={[styles.pickerSection, { backgroundColor: theme.isDark ? '#0F0F0F' : theme.colors.gray50 }]}>
          <MonthPicker selected={filter} onSelect={setFilter} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Month heading */}
          <Typography variant="title2" style={styles.monthLabel}>
            {monthLabel}
          </Typography>

          {report.sessionCount === 0 ? (
            <EmptyState
              emoji="📊"
              title={t('reports.no_sessions_month')}
              body={t('reports.no_data')}
            />
          ) : (
            <>
              <MonthlyStats report={report} />
              <WeeklyChart buckets={weeklyBuckets} maxMinutes={maxWeeklyMinutes} />
            </>
          )}

          {/* Export button */}
          <View style={styles.exportSection}>
            <Button
              label={isGenerating ? t('reports.pdf_generating') : t('reports.export_pdf')}
              onPress={() => void handleExport()}
              variant="primary"
              fullWidth
              disabled={!canExport}
              loading={isGenerating}
              accessibilityLabel={t('accessibility.export_pdf')}
              accessibilityHint={
                report.sessions.length === 0
                  ? t('reports.no_sessions_month')
                  : t('common.done')
              }
            />
            {report.sessions.length === 0 && (
              <Typography
                variant="caption1"
                color={theme.colors.gray400}
                style={styles.noEntriesHint}
              >
                {t('reports.no_sessions_month')}
              </Typography>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    titleSection: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    pickerSection: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray200,
    },
    content: {
      padding: Spacing.md,
      paddingBottom: Spacing.xxl,
    },
    monthLabel: {
      marginBottom: Spacing.md,
    },
    exportSection: {
      marginTop: Spacing.xl,
    },
    noEntriesHint: {
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
  });
}
