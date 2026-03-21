// ══════════════════════════════════════════════════
// FILE: src/features/reports/hooks/useReports.ts
// PURPOSE: Monthly report computation hook
// ══════════════════════════════════════════════════

import { useMemo, useState } from 'react';
import { useTimerStore } from '@store/timerStore';
import { useSettingsStore } from '@store/settingsStore';
import { buildWeeklyBuckets, getCurrentMonthYear } from '@shared/utils/dateUtils';
import { calculateEarnings } from '@shared/utils/formatUtils';
import type { MonthlyReport, ReportFilter } from '@core/types/models';

export interface UseReportsReturn {
  filter: ReportFilter;
  setFilter: (filter: ReportFilter) => void;
  report: MonthlyReport;
  weeklyBuckets: ReturnType<typeof buildWeeklyBuckets>;
  maxWeeklyMinutes: number;
}

export function useReports(): UseReportsReturn {
  const [filter, setFilter] = useState<ReportFilter>(getCurrentMonthYear());

  const getSessionsForMonth = useTimerStore((s) => s.getSessionsForMonth);
  const employers = useSettingsStore((s) => s.employers);
  const getDefaultEmployer = useSettingsStore((s) => s.getDefaultEmployer);

  const sessions = useMemo(
    () => getSessionsForMonth(filter.month, filter.year),
    [filter.month, filter.year, getSessionsForMonth],
  );

  const report = useMemo<MonthlyReport>(() => {
    const completed = sessions.filter(
      (s) => s.durationMinutes !== null && s.endTime !== null,
    );
    const totalMinutes = completed.reduce(
      (acc, s) => acc + (s.durationMinutes ?? 0),
      0,
    );
    const defaultEmployer = getDefaultEmployer();
    const earnings =
      defaultEmployer.hourlyRate !== null
        ? calculateEarnings(totalMinutes, defaultEmployer.hourlyRate)
        : null;

    return {
      filter,
      sessions: completed,
      totalMinutes,
      sessionCount: completed.length,
      earnings,
    };
  }, [sessions, filter, getDefaultEmployer]);

  const weeklyBuckets = useMemo(
    () => buildWeeklyBuckets(sessions, filter.month, filter.year),
    [sessions, filter.month, filter.year],
  );

  const maxWeeklyMinutes = useMemo(
    () => Math.max(...weeklyBuckets.map((b) => b.totalMinutes), 1),
    [weeklyBuckets],
  );

  return { filter, setFilter, report, weeklyBuckets, maxWeeklyMinutes };
}
