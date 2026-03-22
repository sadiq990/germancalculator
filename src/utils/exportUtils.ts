import type { TimeEntry } from '../types/entry.types';

export function generateCSV(entries: TimeEntry[]): string {
  let csv = 'Date,Start,End,Duration,Note\n';
  entries.forEach(e => {
    csv += `${e.date},${e.startTime},${e.endTime || ''},${e.duration},"${e.note || ''}"\n`;
  });
  return csv;
}
