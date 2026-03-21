// ══════════════════════════════════════════════════
// FILE: src/store/settingsStore.ts
// PURPOSE: Zustand settings store — user preferences, employers, Pro status
// ══════════════════════════════════════════════════

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import * as Crypto from 'expo-crypto';
import type { UserSettings, Employer } from '@core/types/models';
import { DEFAULT_SETTINGS, DEFAULT_EMPLOYER } from '@core/types/models';
import { settingsRepository } from '@core/storage/settingsRepository';
import { notificationService } from '@core/services/notificationService';
import { analyticsService } from '@core/services/analyticsService';
import { changeLanguage } from '@locales/i18n';

export interface SettingsStore {
  settings: UserSettings;
  employers: Employer[];
  isLoading: boolean;
  error: string | null;

  // Settings actions
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  clearError: () => void;

  // Employer actions
  addEmployer: (employer: Omit<Employer, 'id' | 'createdAt'>) => Promise<void>;
  updateEmployer: (id: string, partial: Partial<Employer>) => Promise<void>;
  deleteEmployer: (id: string) => Promise<void>;
  setDefaultEmployer: (id: string) => Promise<void>;

  // Computed
  getDefaultEmployer: () => Employer;
  getEmployerById: (id: string) => Employer | null;
}

export const useSettingsStore = create<SettingsStore>()(
  immer((set, get) => ({
    settings: { ...DEFAULT_SETTINGS },
    employers: [{ ...DEFAULT_EMPLOYER, createdAt: Date.now() }],
    isLoading: false,
    error: null,

    loadSettings: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const [settings, employers] = await Promise.all([
          settingsRepository.getSettings(),
          settingsRepository.getEmployers(),
        ]);

        set((state) => {
          state.settings = settings;
          state.employers = employers;
          state.isLoading = false;
        });
      } catch {
        set((state) => {
          state.isLoading = false;
          state.error = 'errors.storage_read';
        });
      }
    },

    updateSettings: async (partial: Partial<UserSettings>) => {
      const prevSettings = get().settings;
      const updated: UserSettings = { ...prevSettings, ...partial };

      set((state) => {
        state.settings = updated;
      });

      try {
        await settingsRepository.saveSettings(updated);

        // Side effects
        if (partial.locale !== undefined && partial.locale !== prevSettings.locale) {
          await changeLanguage(partial.locale);
        }

        if (
          partial.reminderEnabled !== undefined ||
          partial.reminderDays !== undefined ||
          partial.reminderTime !== undefined
        ) {
          await notificationService.scheduleReminders({
            enabled: updated.reminderEnabled,
            days: updated.reminderDays,
            time: updated.reminderTime,
          });
          if (updated.reminderEnabled) {
            analyticsService.track({ name: analyticsService.Events.REMINDER_SET });
          }
        }

        analyticsService.track({ name: analyticsService.Events.SETTINGS_CHANGED });
      } catch {
        // Rollback
        set((state) => {
          state.settings = prevSettings;
          state.error = 'errors.storage_write';
        });
      }
    },

    resetSettings: async () => {
      try {
        const defaults = await settingsRepository.resetToDefaults();
        set((state) => {
          state.settings = defaults;
        });
        await notificationService.cancelAllReminders();
      } catch {
        set((state) => {
          state.error = 'errors.storage_write';
        });
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    addEmployer: async (employerData) => {
      const id = await Crypto.randomUUID();
      const newEmployer: Employer = {
        ...employerData,
        id,
        createdAt: Date.now(),
      };

      set((state) => {
        state.employers.push(newEmployer);
      });

      try {
        await settingsRepository.saveEmployers(get().employers);
      } catch {
        set((state) => {
          state.employers = state.employers.filter((e) => e.id !== id);
          state.error = 'errors.storage_write';
        });
      }
    },

    updateEmployer: async (id: string, partial: Partial<Employer>) => {
      const prev = get().employers;
      set((state) => {
        const idx = state.employers.findIndex((e) => e.id === id);
        if (idx >= 0) {
          state.employers[idx] = { ...(state.employers[idx] as Employer), ...partial };
        }
      });

      try {
        await settingsRepository.saveEmployers(get().employers);
      } catch {
        set((state) => {
          state.employers = prev;
          state.error = 'errors.storage_write';
        });
      }
    },

    deleteEmployer: async (id: string) => {
      const prev = get().employers;
      const employer = prev.find((e) => e.id === id);

      // Cannot delete default employer
      if (employer?.isDefault === true) return;

      set((state) => {
        state.employers = state.employers.filter((e) => e.id !== id);
      });

      try {
        await settingsRepository.saveEmployers(get().employers);
      } catch {
        set((state) => {
          state.employers = prev;
          state.error = 'errors.storage_write';
        });
      }
    },

    setDefaultEmployer: async (id: string) => {
      const prev = get().employers;
      set((state) => {
        state.employers = state.employers.map((e) => ({
          ...e,
          isDefault: e.id === id,
        }));
      });

      try {
        await settingsRepository.saveEmployers(get().employers);
      } catch {
        set((state) => {
          state.employers = prev;
          state.error = 'errors.storage_write';
        });
      }
    },

    getDefaultEmployer: () => {
      const { employers } = get();
      return employers.find((e) => e.isDefault) ?? employers[0] ?? { ...DEFAULT_EMPLOYER, createdAt: Date.now() };
    },

    getEmployerById: (id: string) => {
      return get().employers.find((e) => e.id === id) ?? null;
    },
  })),
);
