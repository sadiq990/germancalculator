import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import { Moon, Sun, Monitor, Globe } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { currentLanguage } = useTranslation();
  const setLanguage = useLanguageStore(state => state.setLanguage);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const nextLang = () => {
    const langs = ['de', 'en', 'tr', 'fr', 'it'] as const;
    const currentIdx = langs.indexOf(currentLanguage as any);
    const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % langs.length;
    setLanguage(langs[nextIdx] as any);
  };

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 bg-white dark:bg-dark-surface border-b border-neutral-200 dark:border-dark-border sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-lg leading-none">A</span>
        </div>
        <span className="font-semibold text-lg text-neutral-900 dark:text-dark-text hidden sm:block">
          atWork Clone
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={nextLang} className="uppercase font-semibold w-12" title="Switch Language">
          <Globe className="w-4 h-4 mr-1" />
          {currentLanguage !== 'system' ? currentLanguage : 'DE'}
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleTheme} title="Toggle Theme" className="w-10 px-0">
          {getThemeIcon()}
        </Button>
      </div>
    </header>
  );
};
