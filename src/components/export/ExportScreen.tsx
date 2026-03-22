import React, { useState } from 'react';
import { PageTransition } from '../layout/PageTransition';
import { useTranslation } from '../../hooks/useTranslation';
import { useExport } from '../../hooks/useExport';
import { useEntryStore } from '../../store/useEntryStore';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ExportPreview } from './ExportPreview';
import type { ExportConfig } from '../../types/export.types';

export const ExportScreen: React.FC = () => {
  const { t } = useTranslation();
  const { exportData } = useExport();
  const entries = useEntryStore(state => state.entries);

  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [period, setPeriod] = useState('all');

  const config: ExportConfig = {
    format,
    columns: [],
    includeHeader: true,
    includeSondertage: true,
    groupByKunde: false
  };

  return (
    <PageTransition>
      <div className="p-4 max-w-2xl mx-auto w-full pb-24 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">{t('nav.export')}</h1>

        <div className="flex flex-col gap-4 bg-white dark:bg-dark-surface p-4 rounded-xl border border-neutral-100 dark:border-dark-border">
          <Select
            label="Format"
            value={format}
            onChange={e => setFormat(e.target.value as any)}
            options={[
              { value: 'csv', label: 'CSV (Excel)' },
              { value: 'pdf', label: 'PDF Dokument' }
            ]}
          />

          <Select
            label={t('export.period')}
            value={period}
            onChange={e => setPeriod(e.target.value)}
            options={[
              { value: 'all', label: 'Alle Einträge' },
              { value: 'month', label: 'Dieser Monat' }
            ]}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">{t('export.preview')}</h2>
          <ExportPreview itemsCount={entries.length} />
        </div>

        <div className="w-full pt-4">
          <Button className="w-full" size="lg" onClick={() => exportData(config, entries)}>
            {t('export.download')} ({format.toUpperCase()})
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};
