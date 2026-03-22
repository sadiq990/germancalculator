import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Languages, Bell, ShieldCheck } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useTranslation } from '../../hooks/useTranslation';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const toggleLang = () => {
    const langs = ['de', 'en', 'tr', 'fr', 'it'] as const;
    const currentIdx = langs.indexOf(language as any);
    const nextIdx = (currentIdx + 1) % langs.length;
    setLanguage(langs[nextIdx] as any);
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 glass z-40 px-4 sm:px-8 border-b dark:border-ios-dark-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-ios-dark-5 bg-ios-blue/10 flex items-center justify-center">
               <ShieldCheck size={12} className="text-ios-blue" />
            </div>
          ))}
        </div>
        <span className="hidden sm:inline text-xs font-semibold text-neutral-400 dark:text-ios-gray-1">
          {t('common.secure_data', 'Local & Encrypted')}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Toggle */}
        <button 
          onClick={toggleLang}
          className="p-2 rounded-ios-md hover:bg-neutral-100 dark:hover:bg-ios-dark-4 group flex items-center gap-2"
        >
          <Languages size={20} className="text-neutral-500 dark:text-ios-gray-1 group-hover:text-ios-blue" />
          <span className="text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-ios-gray-2 group-hover:text-ios-blue">
            {language}
          </span>
        </button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-ios-md bg-neutral-100 dark:bg-ios-dark-4 text-ios-blue hover:shadow-ios transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
        
        {/* Notification Mockup */}
        <button className="relative p-2.5 rounded-ios-md hover:bg-neutral-100 dark:hover:bg-ios-dark-4 transition-all">
          <Bell size={20} className="text-neutral-500 dark:text-ios-gray-1" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-ios-red rounded-full ring-2 ring-white dark:ring-ios-dark-4" />
        </button>
      </div>
    </header>
  );
};
