// ══════════════════════════════════════════════════
// FILE: src/shared/utils/timeUtils.ts
// PURPOSE: Time formatting and calculation utilities — German locale, no moment.js
// ══════════════════════════════════════════════════

/**
 * Format elapsed seconds as HH:MM:SS
 */
export function formatElapsedTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

/**
 * Format minutes as HH:MM (no seconds)
 */
export function formatMinutesAsHHMM(totalMinutes: number): string {
  const safe = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Format minutes as "X,5h" German style (e.g. 90 minutes = "1,5h", 60 = "1h")
 */
export function formatMinutesAsDecimalHours(totalMinutes: number): string {
  const hours = totalMinutes / 60;
  // Round to nearest 0.5
  const rounded = Math.round(hours * 2) / 2;
  if (rounded % 1 === 0) {
    return `${rounded}h`;
  }
  // Use German decimal comma
  return `${rounded.toString().replace('.', ',')}h`;
}

/**
 * Format a Unix ms timestamp as HH:MM (24h, German)
 */
export function formatTimestamp(ms: number): string {
  const date = new Date(ms);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Calculate duration in minutes between two Unix ms timestamps
 */
export function calcDurationMinutes(startMs: number, endMs: number): number {
  return Math.max(0, Math.floor((endMs - startMs) / 60000));
}

/**
 * Calculate elapsed seconds from a start timestamp to now
 */
export function calcElapsedSeconds(startMs: number): number {
  return Math.max(0, Math.floor((Date.now() - startMs) / 1000));
}

/**
 * Parse "HH:mm" string into total minutes from midnight
 */
export function parseTimeStringToMinutes(time: string): number | null {
  const parts = time.split(':');
  if (parts.length !== 2) return null;
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/**
 * Get current week number (ISO 8601)
 */
export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
