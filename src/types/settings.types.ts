export interface WorkLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;                // meters
  autoStart: boolean;
}

export interface Zuschlag {
  id: string;
  name: string;
  percentage: number;
  appliesTo: 'night' | 'weekend' | 'holiday' | 'custom';
  timeRange?: { from: string; to: string };
}

export interface SollStunden {
  type: 'daily' | 'weekly' | 'monthly';
  hours: number;
  workDays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  validFrom: string;
}

export interface AppSettings {
  hourlyRate: number;
  currency: string;              // 'EUR'
  timeRounding: 0 | 15 | 30 | 60;
  timeFormat: 'decimal' | 'hhmm';
  language: 'de' | 'en' | 'tr' | 'fr' | 'it';
  theme: 'light' | 'dark' | 'system';
  sollStunden: SollStunden[];
  vacationDaysPerYear: number;
  locations: WorkLocation[];
  autoBreak: { enabled: boolean; afterMinutes: number; breakMinutes: number };
  zuschlaege: Zuschlag[];
}
