import { format, parseISO, isValid, isWithinInterval } from 'date-fns';
import { de, enUS, tr, fr, it } from 'date-fns/locale';

export function getLocaleObject(lang: string) {
  switch (lang) {
    case 'en': return enUS;
    case 'tr': return tr;
    case 'fr': return fr;
    case 'it': return it;
    case 'de':
    default: return de;
  }
}

export function formatDate(dateString: string, lang: string = 'de'): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return '';
  return format(date, 'dd.MM.yyyy', { locale: getLocaleObject(lang) });
}

export function formatMonthYear(dateString: string, lang: string = 'de'): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return '';
  return format(date, 'MMMM yyyy', { locale: getLocaleObject(lang) });
}

export function isDateInPeriod(dateStr: string, periodStart: string, periodEnd: string): boolean {
  const date = parseISO(dateStr);
  const start = parseISO(periodStart);
  const end = parseISO(periodEnd);
  return isValid(date) && isWithinInterval(date, { start, end });
}

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}
