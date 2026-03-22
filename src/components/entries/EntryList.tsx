import React, { useState } from 'react';
import { useEntryStore } from '../../store/useEntryStore';
import { EntryCard } from './EntryCard';
import { EntryForm } from './EntryForm';
import { EmptyState } from '../ui/EmptyState';
import { List } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import type { TimeEntry } from '../../types/entry.types';

export const EntryList: React.FC = () => {
  const entries = useEntryStore(state => state.entries);
  const { t } = useTranslation();
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  const sortedEntries = [...entries].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.startTime.localeCompare(a.startTime);
  });

  return (
    <div className="p-4 max-w-3xl mx-auto w-full">
      {sortedEntries.length === 0 ? (
        <EmptyState 
          icon={<List className="w-12 h-12" />} 
          title={t('entries.list_empty')} 
        />
      ) : (
        <div className="flex flex-col gap-2 relative">
          {sortedEntries.map(entry => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              onClick={() => setSelectedEntry(entry)} 
            />
          ))}
        </div>
      )}

      {selectedEntry && (
        <EntryForm 
          entry={selectedEntry} 
          isOpen={true} 
          onClose={() => setSelectedEntry(null)} 
        />
      )}
    </div>
  );
};
