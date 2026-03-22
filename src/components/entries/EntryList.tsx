import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useEntryStore } from '../../store/useEntryStore';
import { EntryCard } from './EntryCard';
import { EntryForm } from './EntryForm';
import { SondertagForm } from './SondertagForm';
import { SondertagCard } from './SondertagCard';
import { useSondertagStore } from '../../store/useSondertagStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Plus, CalendarRange, Clock3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export const EntryList: React.FC = () => {
  const { t } = useTranslation();
  const entries = useEntryStore(state => state.entries);
  const sondertage = useSondertagStore(state => state.sondertage);
  
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'work' | 'special'>('work');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto w-full py-4 space-y-6"
    >
      {/* List Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">{t('entries.title')}</h1>
          <p className="text-sm text-neutral-500">{entries.length} {t('entries.items_total')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="rounded-full bg-white dark:bg-ios-dark-4 shadow-sm border dark:border-ios-dark-3">
            <Filter size={16} className="mr-2" />
            {t('common.filter')}
          </Button>
          <Button onClick={() => setIsFormOpen(true)} size="sm" className="shadow-ios group">
            <Plus size={18} className="mr-1 group-hover:rotate-90 transition-transform" />
            {t('common.add')}
          </Button>
        </div>
      </div>

      {/* Segmented Control (iOS style) */}
      <div className="mx-2 p-1 bg-neutral-200/50 dark:bg-ios-dark-4 rounded-ios-md flex gap-1 h-11">
        <button 
          onClick={() => setActiveTab('work')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-[8px] text-sm font-bold transition-all ${activeTab === 'work' ? 'bg-white dark:bg-ios-dark-5 shadow-sm dark:text-white' : 'text-neutral-500'}`}
        >
          <Clock3 size={16} />
          {t('entries.tab_work')}
        </button>
        <button 
          onClick={() => setActiveTab('special')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-[8px] text-sm font-bold transition-all ${activeTab === 'special' ? 'bg-white dark:bg-ios-dark-5 shadow-sm dark:text-white' : 'text-neutral-500'}`}
        >
          <CalendarRange size={16} />
          {t('entries.tab_special')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'work' ? (
          <motion.div 
            key="work-list"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3 px-2"
          >
            {entries.length > 0 ? (
              entries.sort((a,b) => b.date.localeCompare(a.date)).map((entry) => (
                <EntryCard 
                  key={entry.id} 
                  entry={entry} 
                  onClick={() => {
                    setSelectedEntry(entry);
                    setIsFormOpen(true);
                  }} 
                />
              ))
            ) : (
              <EmptyState title={t('entries.empty')} description={t('entries.empty_hint')} />
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="special-list"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-3 px-2"
          >
            {sondertage.length > 0 ? (
              sondertage.map((tag) => (
                <SondertagCard key={tag.id} tag={tag} />
              ))
            ) : (
              <EmptyState title={t('entries.special_empty')} description={t('entries.special_hint')} />
            )}
            <Button variant="ghost" className="w-full h-16 border-2 border-dashed border-neutral-200 dark:border-ios-dark-3 rounded-ios-lg text-neutral-400 hover:border-ios-blue hover:text-ios-blue">
               <Plus size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <EntryForm 
        isOpen={isFormOpen && activeTab === 'work'} 
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry}
      />
    </motion.div>
  );
};
