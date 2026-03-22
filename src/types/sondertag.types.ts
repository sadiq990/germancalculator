export type SondertagType = 'urlaub' | 'krankheit' | 'feiertag' | 'other';

export interface Sondertag {
  id: string;
  date: string;
  type: SondertagType;
  durationMinutes: number;         // e.g. 480 for a full day (8 hours)
  note: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}
