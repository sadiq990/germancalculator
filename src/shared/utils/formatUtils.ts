// ══════════════════════════════════════════════════
// FILE: src/shared/utils/formatUtils.ts
// PURPOSE: German number, currency, and duration formatting
// ══════════════════════════════════════════════════

/**
 * Format euros in German locale: 1234.5 → "1.234,50 €"
 */
export function formatCurrencyDE(amount: number): string {
  return (
    amount.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €'
  );
}

/**
 * Format hourly rate for display: 15.5 → "15,50 €/h"
 */
export function formatHourlyRate(rate: number): string {
  return (
    rate.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €/h'
  );
}

/**
 * Format minutes as "Xh Ym" German style
 * e.g. 90 → "1h 30Min", 60 → "1h", 45 → "45Min"
 */
export function formatDurationHuman(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}Min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}Min`;
}

/**
 * Format minutes as HH:MM
 */
export function formatDurationHHMM(totalMinutes: number): string {
  const h = Math.floor(Math.max(0, totalMinutes) / 60)
    .toString()
    .padStart(2, '0');
  const m = (Math.max(0, totalMinutes) % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Parse a German decimal string to number: "15,50" → 15.5
 */
export function parseGermanDecimal(value: string): number | null {
  const normalized = value.replace('.', '').replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Format a number with German decimal comma for display in inputs
 */
export function formatDecimalDE(value: number, decimals = 2): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Calculate earnings given minutes worked and hourly rate
 */
export function calculateEarnings(totalMinutes: number, hourlyRate: number): number {
  return (totalMinutes / 60) * hourlyRate;
}
