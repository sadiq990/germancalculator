import React from 'react';
import { Card } from '../ui/Card';
import type { TimeEntry } from '../../types/entry.types';
import { formatMinutesAsHHMM } from '../../utils/timeUtils';
import { useTranslation } from '../../hooks/useTranslation';

interface EntryCardProps {
  entry: TimeEntry;
  onClick: () => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick }) => {
  const { t } = useTranslation();

  return (
    <Card hoverable onClick={onClick} className="mb-3 p-4 flex items-center justify-between pointer-events-auto">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900 dark:text-dark-text">
            {entry.startTime} - {entry.endTime || '...'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-dark-border text-neutral-600 dark:text-dark-text-secondary font-medium">
            {formatMinutesAsHHMM(entry.duration)}h
          </span>
        </div>
        <div className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1 max-w-[200px] truncate">
          {entry.note || t('entries.note') + '...'}
        </div>
      </div>
    </Card>
  );
};
