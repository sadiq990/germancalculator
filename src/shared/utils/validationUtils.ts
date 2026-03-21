// ══════════════════════════════════════════════════
// FILE: src/shared/utils/validationUtils.ts
// PURPOSE: Input validation — legal limits, data integrity checks
// ══════════════════════════════════════════════════

import type { WorkSession } from '@core/types/models';

// German Arbeitszeitgesetz limits
export const LEGAL_LIMITS = {
  MAX_DAILY_HOURS: 10,
  MAX_WEEKLY_HOURS: 48,
  MAX_SESSION_HOURS: 24,
  MINIJOB_MONTHLY_HOURS: 43, // ~520€/yr at minimum wage
  NOTE_MAX_CHARS: 140,
  DISPLAY_NAME_MAX_CHARS: 60,
  EMPLOYER_NAME_MAX_CHARS: 80,
} as const;

export type LegalWarning =
  | { type: 'daily_overwork'; hoursWorked: number }
  | { type: 'weekly_overwork'; hoursWorked: number }
  | { type: 'minijob_approaching'; hoursWorked: number }
  | { type: 'break_reminder'; hoursWorked: number };

/**
 * Check today's total and return applicable warnings
 */
export function checkLegalWarnings(
  todayMinutes: number,
  weeklyMinutes: number,
  monthlyMinutes: number,
): LegalWarning[] {
  const warnings: LegalWarning[] = [];
  const todayHours = todayMinutes / 60;
  const weeklyHours = weeklyMinutes / 60;
  const monthlyHours = monthlyMinutes / 60;

  // Single session > 6h without break required by §4 ArbZG
  if (todayHours > 6 && todayHours <= LEGAL_LIMITS.MAX_DAILY_HOURS) {
    warnings.push({ type: 'break_reminder', hoursWorked: todayHours });
  }

  if (todayHours > LEGAL_LIMITS.MAX_DAILY_HOURS) {
    warnings.push({ type: 'daily_overwork', hoursWorked: todayHours });
  }

  if (weeklyHours > LEGAL_LIMITS.MAX_WEEKLY_HOURS) {
    warnings.push({ type: 'weekly_overwork', hoursWorked: weeklyHours });
  }

  if (monthlyHours > LEGAL_LIMITS.MINIJOB_MONTHLY_HOURS) {
    warnings.push({ type: 'minijob_approaching', hoursWorked: monthlyHours });
  }

  return warnings;
}

/**
 * Validate if a new session overlaps with existing sessions
 */
export function findOverlappingSession(
  startTime: number,
  endTime: number,
  sessions: WorkSession[],
  excludeId?: string,
): WorkSession | null {
  for (const session of sessions) {
    if (session.id === excludeId) continue;
    if (session.endTime === null) continue;

    // Overlap: new starts before existing ends AND new ends after existing starts
    if (startTime < session.endTime && endTime > session.startTime) {
      return session;
    }
  }
  return null;
}

/**
 * Validate display name
 */
export function validateDisplayName(name: string): string | null {
  if (name.trim().length === 0) return 'errors.name_required';
  if (name.length > LEGAL_LIMITS.DISPLAY_NAME_MAX_CHARS) return null; // truncate silently
  return null;
}

/**
 * Validate hourly rate string (German format)
 */
export function validateHourlyRate(value: string): boolean {
  if (value.trim() === '') return true; // Optional field
  // Allow format: 15, 15.5, 15,5, 15.50, 15,50
  const normalized = value.replace(',', '.');
  const n = parseFloat(normalized);
  return !isNaN(n) && n >= 0 && n < 1000;
}

/**
 * Smart stop suggestion: shows banner if working > defaultShiftMinutes
 */
export function shouldShowSmartStop(
  elapsedSeconds: number,
  defaultShiftMinutes: number,
): boolean {
  return elapsedSeconds >= defaultShiftMinutes * 60;
}

/**
 * Clock corruption guard: session > 24h is likely from a corrupt clock change
 */
export function isSessionCorrupted(startTime: number): boolean {
  return Date.now() - startTime > LEGAL_LIMITS.MAX_SESSION_HOURS * 60 * 60 * 1000;
}
