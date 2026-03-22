import React from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { PauseCircle, PlayCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ActiveEntryProps {
  isActive: boolean;
  isPaused: boolean;
  onPauseResume: () => void;
}

export const ActiveEntry: React.FC<ActiveEntryProps> = ({ isActive, isPaused, onPauseResume }) => {
  const { t } = useTranslation();

  if (!isActive) return null;

  return (
    <Card className="p-4 mx-4 mt-4 flex items-center justify-between bg-primary/5 border-primary/20 dark:bg-primary/5 dark:border-primary/20 shadow-none">
      <div>
        <p className="text-sm font-medium text-primary dark:text-primary-dark">
          {isPaused ? t('timer.pause') : t('timer.active_shift')}
        </p>
        <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-1 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            {!isPaused && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? 'bg-warning' : 'bg-primary'}`}></span>
          </span>
          Tracking activity...
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={onPauseResume}>
        {isPaused ? <PlayCircle className="w-6 h-6 text-primary" /> : <PauseCircle className="w-6 h-6 text-warning" />}
      </Button>
    </Card>
  );
};
