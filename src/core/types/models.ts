// ══════════════════════════════════════════════════
// FILE: src/core/types/models.ts
// PURPOSE: Core data model interfaces for the entire app
// ══════════════════════════════════════════════════

export interface WorkSession {
  id: string;                     // expo-crypto UUID v4
  startTime: number;              // Unix ms timestamp
  endTime: number | null;         // null = currently active
  durationMinutes: number | null; // null until session ends
  note: string | null;            // optional shift note (max 140 chars)
  employerId: string | null;      // null = default employer
  createdAt: number;              // Unix ms timestamp
  updatedAt: number;              // Unix ms timestamp
}

export interface Employer {
  id: string;
  name: string;
  color: string;                  // hex, for visual distinction
  hourlyRate: number | null;
  isDefault: boolean;
  createdAt: number;
}

export interface UserSettings {
  displayName: string;
  locale: SupportedLocale;
  isPro: boolean;
  reminderEnabled: boolean;
  reminderDays: WeekDay[];        // [1,2,3,4,5] = Mon-Fri
  reminderTime: string;           // "08:00" HH:mm format
  defaultShiftMinutes: number;    // for smart stop suggestion
  onboardingCompleted: boolean;
  theme: 'light' | 'dark' | 'system';
}

export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7; // ISO weekday

export type SupportedLocale = 'de' | 'en' | 'fr' | 'tr';

export interface ReportFilter {
  month: number; // 1-12
  year: number;
}

export interface MonthlyReport {
  filter: ReportFilter;
  sessions: WorkSession[];
  totalMinutes: number;
  sessionCount: number;
  earnings: number | null; // null if no hourly rate set
}

export const DEFAULT_EMPLOYER_COLOR = '#1558C9';

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: '',
  locale: 'de',
  isPro: false,
  reminderEnabled: false,
  reminderDays: [1, 2, 3, 4, 5],
  reminderTime: '08:00',
  defaultShiftMinutes: 480, // 8 hours
  onboardingCompleted: false,
  theme: 'system',
};

export const DEFAULT_EMPLOYER: Employer = {
  id: 'default',
  name: 'Arbeitgeber',
  color: DEFAULT_EMPLOYER_COLOR,
  hourlyRate: null,
  isDefault: true,
  createdAt: 0,
};

// Timer state machine — discriminated union
export type TimerState =
  | { status: 'idle' }
  | { status: 'running'; sessionId: string; startTime: number }
  | { status: 'saving' }
  | { status: 'error'; message: string };

// Weekly summary for the chart
export interface WeeklyBucket {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalMinutes: number;
  sessionCount: number;
}

// For overlap detection
export interface TimeRange {
  startTime: number;
  endTime: number;
}
