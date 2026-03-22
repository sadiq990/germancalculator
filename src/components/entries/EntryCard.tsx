import React from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { formatDate } from '../../utils/dateUtils';
import { formatMinutesAsHHMM } from '../../utils/timeUtils';
import type { TimeEntry } from '../../types/entry.types';
import { Calendar, ChevronRight, MessageSquare } from 'lucide-react';

interface EntryCardProps {
  entry: TimeEntry;
  onClick: () => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick }) => {
  const { t } = useTranslation();

  return (
    <Card 
      hoverable 
      onClick={onClick}
      className="p-4 flex items-center justify-between group group-active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Day Indicator */}
        <div className="w-12 h-12 rounded-ios-md bg-ios-blue/10 flex flex-col items-center justify-center text-ios-blue">
          <span className="text-[10px] font-bold uppercase">{formatDate(entry.date).split('.')[1]}</span>
          <span className="text-lg font-extrabold leading-none">{formatDate(entry.date).split('.')[0]}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white">
              {entry.startTime} — {entry.endTime || '...'}
            </span>
            {entry.note && (
              <div className="flex items-center gap-1 text-[10px] bg-neutral-100 dark:bg-ios-dark-4 px-1.5 py-0.5 rounded-full text-neutral-500 dark:text-ios-gray-2">
                <MessageSquare size={10} />
                <span>Note</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
             <Calendar size={12} />
             <span>{formatDate(entry.date)}</span>
             {entry.kundeId && (
               <>
                 <span className="text-neutral-300">•</span>
                 <span className="text-ios-blue font-medium">{entry.kundeId}</span>
               </>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
            {formatMinutesAsHHMM(entry.duration)}
          </p>
          <p className="text-[10px] font-bold text-ios-green uppercase tracking-tighter">
            {t('common.verified')}
          </p>
        </div>
        <ChevronRight size={18} className="text-neutral-300 group-hover:text-ios-blue group-hover:translate-x-1 transition-all" />
      </div>
    </Card>
  );
};
