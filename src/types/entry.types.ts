export interface CustomAttribute {
  key: string;
  label: string;
  type: 'money' | 'duration' | 'text' | 'status';
  value: string | number;
  currency?: string;
}

export interface TimeEntry {
  id: string;
  date: string;                    // ISO 'YYYY-MM-DD'
  startTime: string;               // 'HH:MM'
  endTime: string | null;          // null = active/running
  duration: number;                // minutes
  isOvernight: boolean;
  timezone: string;                // 'Europe/Berlin'
  kundeId: string | null;
  projektId: string | null;
  aufgabeId: string | null;
  note: string;
  customAttributes: CustomAttribute[];
  type: 'work' | 'sondertag' | 'correction';
  sondertagType?: 'urlaub' | 'krankheit' | 'feiertag' | 'other';
  isPaid: boolean;
  isInvoiced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EntryTemplate {
  id: string;
  name: string;
  entries: Omit<TimeEntry, 'id' | 'date' | 'createdAt' | 'updatedAt'>[];
}
