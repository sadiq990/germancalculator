// ══════════════════════════════════════════════════
// FILE: src/core/storage/settingsRepository.ts
// PURPOSE: Repository for UserSettings and Employers — uses SecureStore for sensitive data
// ══════════════════════════════════════════════════

import * as SecureStore from 'expo-secure-store';
import type { UserSettings, Employer } from '@core/types/models';
import { DEFAULT_SETTINGS, DEFAULT_EMPLOYER } from '@core/types/models';
import { STORAGE_KEYS } from './storageKeys';

function isValidSettings(value: unknown): value is Partial<UserSettings> {
  return typeof value === 'object' && value !== null;
}

function isValidEmployer(value: unknown): value is Employer {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['name'] === 'string' &&
    typeof v['color'] === 'string' &&
    (v['hourlyRate'] === null || typeof v['hourlyRate'] === 'number') &&
    typeof v['isDefault'] === 'boolean' &&
    typeof v['createdAt'] === 'number'
  );
}

export const settingsRepository = {
  async getSettings(): Promise<UserSettings> {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEYS.SETTINGS);
      if (raw === null) return { ...DEFAULT_SETTINGS };

      const parsed: unknown = JSON.parse(raw);
      if (!isValidSettings(parsed)) return { ...DEFAULT_SETTINGS };

      // Merge with defaults to handle new fields added in future versions
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  async saveSettings(settings: UserSettings): Promise<void> {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(settings),
    );
  },

  async updateSettings(partial: Partial<UserSettings>): Promise<UserSettings> {
    const current = await settingsRepository.getSettings();
    const updated: UserSettings = { ...current, ...partial };
    await settingsRepository.saveSettings(updated);
    return updated;
  },

  async getEmployers(): Promise<Employer[]> {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEYS.EMPLOYERS);
      if (raw === null) return [{ ...DEFAULT_EMPLOYER, createdAt: Date.now() }];

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [{ ...DEFAULT_EMPLOYER, createdAt: Date.now() }];

      const valid = parsed.filter(isValidEmployer);
      if (valid.length === 0) return [{ ...DEFAULT_EMPLOYER, createdAt: Date.now() }];

      return valid;
    } catch {
      return [{ ...DEFAULT_EMPLOYER, createdAt: Date.now() }];
    }
  },

  async saveEmployers(employers: Employer[]): Promise<void> {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.EMPLOYERS,
      JSON.stringify(employers),
    );
  },

  async addEmployer(employer: Employer): Promise<Employer[]> {
    const current = await settingsRepository.getEmployers();
    const updated = [...current, employer];
    await settingsRepository.saveEmployers(updated);
    return updated;
  },

  async updateEmployer(id: string, partial: Partial<Employer>): Promise<Employer[]> {
    const current = await settingsRepository.getEmployers();
    const updated = current.map((e) =>
      e.id === id ? { ...e, ...partial } : e,
    );
    await settingsRepository.saveEmployers(updated);
    return updated;
  },

  async deleteEmployer(id: string): Promise<Employer[]> {
    const current = await settingsRepository.getEmployers();
    const filtered = current.filter((e) => e.id !== id && !e.isDefault);
    // Ensure at least the default employer exists
    if (filtered.length === 0 || !filtered.some((e) => e.isDefault)) {
      const defaultE: Employer = { ...DEFAULT_EMPLOYER, createdAt: Date.now() };
      filtered.unshift(defaultE);
    }
    await settingsRepository.saveEmployers(filtered);
    return filtered;
  },

  async clearAll(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.SETTINGS);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.EMPLOYERS);
  },

  async resetToDefaults(): Promise<UserSettings> {
    const defaults = { ...DEFAULT_SETTINGS };
    await settingsRepository.saveSettings(defaults);
    return defaults;
  },
} as const;
