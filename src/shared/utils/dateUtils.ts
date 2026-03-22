// ══════════════════════════════════════════════════
// FILE: src/shared/utils/dateUtils.ts
// PURPOSE: Date grouping, German date formatting, weekly buckets
// ══════════════════════════════════════════════════

import {
  format,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isToday,
  isYesterday,
  getISODay,
} from 'date-fns';
import { de, enGB as en, fr, tr } from 'date-fns/locale';
import type { SupportedLocale } from '@core/types/models';
import type { WorkSession, WeeklyBucket } from '@core/types/models';
import { getISOWeekNumber } from './timeUtils';

export interface SessionGroup {
  dateKey: string;      // YYYY-MM-DD for keyExtractor
  label: string;        // "Montag, 14. Juli" or "Heute" or "Gestern"
  date: Date;
  sessions: WorkSession[];
}

/**
 * Group sessions by day and sort descending.
 * Returns groups with localized date labels.
 */
export function groupSessionsByDay(
  sessions: WorkSession[],
  localeCode: SupportedLocale = 'de',
  t?: (key: string) => string
): SessionGroup[] {
  const map = new Map<string, SessionGroup>();

  for (const session of sessions) {
    const date = new Date(session.startTime);
    const key = format(date, 'yyyy-MM-dd');

    if (!map.has(key)) {
      map.set(key, {
        dateKey: key,
        label: getDateLabel(date, localeCode, t),
        date,
        sessions: [],
      });
    }
    map.get(key)!.sessions.push(session);
  }

  // Sort descending by date
  return Array.from(map.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}

const LOCALE_MAP: Record<SupportedLocale, any> = { de, en, fr, tr };

export function getDateLabel(
  date: Date,
  localeCode: SupportedLocale = 'de',
  t?: (key: string) => string
): string {
  if (isToday(date)) return t ? t('common.today') : 'Today';
  if (isYesterday(date)) return t ? t('common.yesterday') : 'Yesterday';
  
  const locale = LOCALE_MAP[localeCode] || de;
  return format(date, 'EEEE, d. MMMM', { locale });
}

/**
 * "Heute", "Gestern", or "Montag, 14. Juli"
 */
export function getGermanDateLabel(date: Date): string {
  if (isToday(date)) return 'Heute';
  if (isYesterday(date)) return 'Gestern';
  // e.g. "Montag, 14. Juli"
  return format(date, 'EEEE, d. MMMM', { locale: de });
}

/**
 * Format date in localized style
 */
export function formatDate(date: Date | number, localeCode: SupportedLocale = 'de'): string {
  const locale = LOCALE_MAP[localeCode] || de;
  // Use dd.MM.yyyy for DE/TR, but maybe MM/dd/yyyy for EN? 
  // Let's stick to dd.MM.yyyy as requested for Germany calculator
  return format(new Date(date), 'dd.MM.yyyy', { locale });
}

/**
 * Format date in German style: dd.MM.yyyy
 */
export function formatDateDE(date: Date | number): string {
  return format(new Date(date), 'dd.MM.yyyy');
}

/**
 * Format month and year localized: "Juli 2025" or "July 2025"
 */
export function formatMonthYear(month: number, year: number, localeCode: SupportedLocale = 'de'): string {
  const date = new Date(year, month - 1, 1);
  const locale = LOCALE_MAP[localeCode] || de;
  return format(date, 'MMMM yyyy', { locale });
}

/**
 * Format month and year in German: "Juli 2025"
 */
export function formatMonthYearDE(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return format(date, 'MMMM yyyy', { locale: de });
}

/**
 * Build weekly buckets for a month (for the chart component)
 */
export function buildWeeklyBuckets(
  sessions: WorkSession[],
  month: number,
  year: number,
): WeeklyBucket[] {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);

  const weekStarts = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }, // Monday
  );

  return weekStarts.map((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekNumber = getISOWeekNumber(weekStart);

    const weekSessions = sessions.filter((s) => {
      const d = new Date(s.startTime);
      return d >= weekStart && d <= weekEnd;
    });

    const totalMinutes = weekSessions.reduce(
      (acc, s) => acc + (s.durationMinutes ?? 0),
      0,
    );

    return {
      weekNumber,
      startDate: weekStart,
      endDate: weekEnd,
      totalMinutes,
      sessionCount: weekSessions.length,
    };
  });
}

/**
 * Get current month and year
 */
export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function getPastMonths(
  count: number,
  localeCode: SupportedLocale = 'de'
): Array<{ month: number; year: number; label: string }> {
  const result: Array<{ month: number; year: number; label: string }> = [];
  const now = new Date();
  const locale = LOCALE_MAP[localeCode] || de;

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: format(date, 'MMMM yyyy', { locale }),
    });
  }

  return result;
}
