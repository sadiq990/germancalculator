import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../types/settings.types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  hourlyRate: 15.0,
  currency: 'EUR',
  timeRounding: 15,
  timeFormat: 'decimal',
  language: 'de',
  theme: 'system',
  sollStunden: [],
  vacationDaysPerYear: 30,
  locations: [],
  autoBreak: { enabled: true, afterMinutes: 360, breakMinutes: 30 },
  zuschlaege: []
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      }))
    }),
    { name: 'settings-storage' }
  )
);
