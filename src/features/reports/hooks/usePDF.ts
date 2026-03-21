// ══════════════════════════════════════════════════
// FILE: src/features/reports/hooks/usePDF.ts
// PURPOSE: PDF generation and sharing hook with export count and rate prompt
// ══════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useSettingsStore } from '@store/settingsStore';
import { pdfService } from '@core/services/pdfService';
import { workHoursRepository } from '@core/storage/workHoursRepository';
import { analyticsService } from '@core/services/analyticsService';
import type { WorkSession, ReportFilter } from '@core/types/models';
import { useToast } from '@shared/hooks/useToast';

export interface UsePDFReturn {
  isGenerating: boolean;
  exportCount: number;
  generateAndShare: (sessions: WorkSession[], filter: ReportFilter) => Promise<void>;
}

export function usePDF(): UsePDFReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const toast = useToast();

  const { settings, employers } = useSettingsStore();

  const generateAndShare = useCallback(
    async (sessions: WorkSession[], filter: ReportFilter) => {
      if (isGenerating) return;
      setIsGenerating(true);

      try {
        const result = await pdfService.generateStundenzettel(
          sessions,
          settings,
          employers,
          filter,
          settings.isPro,
        );

        await pdfService.sharePdf(result.uri);

        const count = await workHoursRepository.incrementPdfExportCount();
        setExportCount(count);

        analyticsService.track({
          name: analyticsService.Events.PDF_EXPORTED,
          properties: { month: filter.month, year: filter.year, isPro: settings.isPro },
        });

        toast.success('PDF erstellt');
      } catch (err) {
        toast.error('PDF konnte nicht erstellt werden');
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, settings, employers, toast],
  );

  return { isGenerating, exportCount, generateAndShare };
}
