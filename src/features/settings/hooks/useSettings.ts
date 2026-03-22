// ══════════════════════════════════════════════════
// FILE: src/features/settings/hooks/useSettings.ts
// PURPOSE: Settings screen logic — form state, data export/import, cleanup
// ══════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSettingsStore } from '@store/settingsStore';
import { useTimerStore } from '@store/timerStore';
import { workHoursRepository } from '@core/storage/workHoursRepository';
import { analyticsService } from '@core/services/analyticsService';
import { useToast } from '@shared/hooks/useToast';
import { parseGermanDecimal } from '@shared/utils/formatUtils';

export interface UseSettingsReturn {
  isExporting: boolean;
  isClearing: boolean;
  exportBackup: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const { resetSettings } = useSettingsStore();
  const { loadSessions } = useTimerStore();

  const exportBackup = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const json = await workHoursRepository.exportAllAsJSON();
      const filename = `stundenrechner_backup_${Date.now()}.json`;
      const uri = `${FileSystem.cacheDirectory ?? ''}${filename}`;
      await FileSystem.writeAsStringAsync(uri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) throw new Error('Sharing not available');

      await Sharing.shareAsync(uri, {
        mimeType: 'application/json',
        dialogTitle: t('settings.export_json'),
      });

      analyticsService.track({ name: analyticsService.Events.BACKUP_EXPORTED });
      toast.success(t('settings.data_exported'));
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, toast]);

  const clearAllData = useCallback(async () => {
    if (isClearing) return;
    setIsClearing(true);

    try {
      await workHoursRepository.clearAllSessions();
      await resetSettings();
      await loadSessions(); // Refresh store
      toast.success(t('settings.data_cleared'));
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setIsClearing(false);
    }
  }, [isClearing, resetSettings, loadSessions, toast]);

  return { isExporting, isClearing, exportBackup, clearAllData };
}
