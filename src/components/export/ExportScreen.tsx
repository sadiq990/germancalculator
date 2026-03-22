import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useExport } from '../../hooks/useExport';
import { useEntryStore } from '../../store/useEntryStore';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ExportPreview } from './ExportPreview';
import { motion } from 'framer-motion';
import { Share2, FileText, Table, Calendar, Lock } from 'lucide-react';
import { Card } from '../ui/Card';
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
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto w-full py-4 space-y-8 pb-32 px-4"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">{t('nav.export')}</h1>
        <p className="text-neutral-500 dark:text-ios-gray-2 text-sm">
          Generate professional reports for your clients or tax office.
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-2">Configuration</h3>
          <Card className="p-6 space-y-6 glass border-none shadow-ios">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Report Format"
                value={format}
                onChange={e => setFormat(e.target.value as any)}
                options={[
                  { value: 'csv', label: 'Excel (CSV)' },
                  { value: 'pdf', label: 'PDF Document' }
                ]}
              />

              <Select
                label={t('export.period')}
                value={period}
                onChange={e => setPeriod(e.target.value)}
                options={[
                  { value: 'all', label: 'All History' },
                  { value: 'month', label: 'Current Month' },
                  { value: 'week', label: 'This Week' }
                ]}
              />
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-ios-md bg-ios-blue/5 border border-ios-blue/10">
               <Lock size={16} className="text-ios-blue shrink-0" />
               <p className="text-[10px] text-ios-blue leading-tight">
                 Reports are generated locally. Your data never leaves your device during the export process.
               </p>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-2">Preview</h3>
          <div className="relative group">
            <ExportPreview itemsCount={entries.length} />
            <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] rounded-ios-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="secondary" size="sm">Zoom Preview</Button>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <Button 
            className="w-full py-5 text-lg shadow-ios-hover" 
            variant="primary" 
            size="lg" 
            onClick={() => exportData(config, entries)}
          >
            <Share2 className="mr-2" size={20} />
            {t('export.download')} ({format.toUpperCase()})
          </Button>
          <p className="text-center text-[10px] text-neutral-400 mt-4 uppercase tracking-widest">
            Compatible with Excel, Numbers & Google Sheets
          </p>
        </div>
      </div>
    </motion.div>
  );
};
