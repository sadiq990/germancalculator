import React from 'react';
import { PageTransition } from '../layout/PageTransition';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguageStore();
  const settings = useSettingsStore(state => state.settings);
  const updateSettings = useSettingsStore(state => state.updateSettings);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full pb-24">
        <h1 className="text-2xl font-bold">{t('nav.settings')}</h1>
        
        <div className="flex flex-col gap-4 bg-white dark:bg-dark-surface p-4 rounded-xl border border-neutral-100 dark:border-dark-border">
          <h2 className="text-lg font-semibold border-b border-neutral-100 dark:border-dark-border pb-2">Appearance</h2>
          
          <Select
            label={t('settings.theme')}
            value={theme}
            onChange={e => setTheme(e.target.value as any)}
            options={[
              { value: 'light', label: t('settings.light') },
              { value: 'dark', label: t('settings.dark') },
              { value: 'system', label: t('settings.system') }
            ]}
          />

          <Select
            label={t('settings.language')}
            value={language}
            onChange={e => setLanguage(e.target.value as any)}
            options={[
              { value: 'system', label: 'System Default' },
              { value: 'de', label: 'Deutsch' },
              { value: 'en', label: 'English' },
              { value: 'tr', label: 'Türkçe' },
              { value: 'fr', label: 'Français' },
              { value: 'it', label: 'Italiano' }
            ]}
          />
        </div>

        <div className="flex flex-col gap-4 bg-white dark:bg-dark-surface p-4 rounded-xl border border-neutral-100 dark:border-dark-border">
          <h2 className="text-lg font-semibold border-b border-neutral-100 dark:border-dark-border pb-2">Business</h2>
          
          <Input 
            type="number" 
            label={t('settings.hourly_rate')} 
            value={settings.hourlyRate}
            onChange={e => updateSettings({ hourlyRate: Number(e.target.value) })}
            rightIcon={<span className="text-neutral-500 font-medium">€</span>}
          />

          <Select
            label={t('settings.rounding')}
            value={settings.timeRounding.toString()}
            onChange={e => updateSettings({ timeRounding: Number(e.target.value) as any })}
            options={[
              { value: '0', label: 'Minute genau' },
              { value: '15', label: '15 Minuten' },
              { value: '30', label: '30 Minuten' }
            ]}
          />
        </div>
      </div>
    </PageTransition>
  );
};
