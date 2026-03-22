import React, { useState } from 'react';
import { 
  User, 
  Moon, 
  Globe, 
  Clock, 
  Trash2, 
  ChevronRight, 
  Smartphone, 
  CreditCard,
  History,
  HardDrive
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useThemeStore } from '../../store/useThemeStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  const toggleLang = () => {
    const langs = ['de', 'en', 'tr', 'fr', 'it'] as const;
    const currentIdx = langs.indexOf(language as any);
    const nextIdx = (currentIdx + 1) % langs.length;
    setLanguage(langs[nextIdx] as any);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-xl mx-auto w-full py-4 space-y-8"
    >
      <div className="px-4">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">{t('settings.title')}</h1>
        <p className="text-neutral-500 dark:text-ios-gray-2">{t('settings.subtitle', 'Personalize your experience')}</p>
      </div>

      <div className="space-y-6">
        {/* Profile Mockup */}
        <section className="space-y-2">
          <h2 className="px-4 text-[10px] font-bold text-neutral-400 dark:text-ios-gray-1 uppercase tracking-widest">{t('settings.account')}</h2>
          <Card className="p-0 overflow-hidden border-none shadow-ios">
             <div className="flex items-center gap-4 p-4 border-b dark:border-ios-dark-4 hover:bg-neutral-50 dark:hover:bg-ios-dark-4 cursor-pointer transition-colors">
               <div className="w-12 h-12 bg-ios-blue rounded-full flex items-center justify-center text-white ring-4 ring-ios-blue/10">
                 <User size={24} />
               </div>
               <div className="flex-1">
                 <p className="font-bold dark:text-white">John Doe</p>
                 <p className="text-xs text-neutral-500">Premium Plan • Active</p>
               </div>
               <ChevronRight size={18} className="text-neutral-300" />
             </div>
             <SettingItem 
               icon={<CreditCard className="text-ios-green" size={20} />} 
               label={t('settings.subscription')} 
               action={<span className="text-sm font-semibold text-ios-blue">Manage</span>}
             />
          </Card>
        </section>

        {/* Preferences */}
        <section className="space-y-2">
          <h2 className="px-4 text-[10px] font-bold text-neutral-400 dark:text-ios-gray-1 uppercase tracking-widest">{t('settings.preferences')}</h2>
          <Card className="p-0 overflow-hidden border-none shadow-ios">
            <SettingItem 
              icon={<Globe className="text-ios-blue" size={20} />} 
              label={t('settings.language')} 
              onClick={toggleLang}
              action={<span className="text-sm font-bold uppercase text-ios-blue">{language}</span>}
            />
            <SettingItem 
              icon={<Moon className="text-ios-indigo" size={20} />} 
              label={t('settings.dark_mode')} 
              onClick={toggleTheme}
              action={
                <div className={`w-12 h-6 rounded-full relative transition-all ${theme === 'dark' ? 'bg-ios-blue' : 'bg-neutral-200 dark:bg-ios-dark-3'}`}>
                  <motion.div 
                    animate={{ x: theme === 'dark' ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </div>
              }
            />
            <SettingItem 
              icon={<Clock className="text-ios-orange" size={20} />} 
              label={t('settings.time_format')} 
              action={<span className="text-sm text-neutral-500">24h</span>}
            />
          </Card>
        </section>

        {/* Data Management */}
        <section className="space-y-2">
          <h2 className="px-4 text-[10px] font-bold text-neutral-400 dark:text-ios-gray-1 uppercase tracking-widest">{t('settings.data')}</h2>
          <Card className="p-0 overflow-hidden border-none shadow-ios">
            <SettingItem icon={<History size={20} className="text-ios-blue" />} label={t('settings.backup')} />
            <SettingItem icon={<HardDrive size={20} className="text-ios-green" />} label={t('settings.storage_usage')} action={<span className="text-sm text-neutral-500">12.4 MB</span>} />
            <SettingItem icon={<Trash2 size={20} className="text-ios-red" />} label={t('settings.delete_data')} destructive />
          </Card>
        </section>

        <div className="flex flex-col items-center gap-2 pt-8 opacity-40">
           <Smartphone size={32} className="text-neutral-400" />
           <p className="text-[10px] font-bold uppercase tracking-widest">Version 1.0.0 (Build 988)</p>
           <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 Standly Labs</p>
        </div>
      </div>
    </motion.div>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  action?: React.ReactNode;
  destructive?: boolean;
}

const SettingItem = ({ icon, label, onClick, action, destructive }: SettingItemProps) => {
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center gap-4 p-4 border-b dark:border-ios-dark-4 last:border-none 
        hover:bg-neutral-50 dark:hover:bg-ios-dark-4 active:bg-neutral-100 dark:active:bg-ios-dark-3
        cursor-pointer transition-colors group
      `}
    >
      <div className="w-10 h-10 rounded-ios-md bg-neutral-100 dark:bg-black flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className={`flex-1 font-semibold ${destructive ? 'text-ios-red' : 'dark:text-white'}`}>
        {label}
      </span>
      {action ? action : <ChevronRight size={18} className="text-neutral-300 group-hover:text-ios-blue transition-colors" />}
    </div>
  );
};
