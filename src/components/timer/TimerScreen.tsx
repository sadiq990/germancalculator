import React from 'react';
import { PageTransition } from '../layout/PageTransition';
import { TimerDisplay } from './TimerDisplay';
import { TimerButton } from './TimerButton';
import { QuickKundeSelect } from './QuickKundeSelect';
import { ActiveEntry } from './ActiveEntry';
import { useTimer } from '../../hooks/useTimer';
import { useTranslation } from '../../hooks/useTranslation';
import { useTimerStore } from '../../store/useTimerStore';

export const TimerScreen: React.FC = () => {
  const timer = useTimer();
  const { t } = useTranslation();

  const handleToggle = () => {
    if (timer.isActive) {
      timer.stopAndSave();
    } else {
      timer.startTimer(timer.currentKundeId);
    }
  };

  const handlePauseResume = () => {
    if (timer.isPaused) {
      timer.resumeTimer();
    } else {
      timer.pauseTimer();
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        
        <TimerDisplay 
          isActive={timer.isActive} 
          isPaused={timer.isPaused} 
          startTime={timer.startTime} 
          totalPausedMs={timer.totalPausedMs}
        />

        <div className="text-sm text-neutral-500 dark:text-dark-text-secondary text-center max-w-xs mb-8">
          {timer.isActive 
            ? timer.isPaused 
                ? t('timer.pause') 
                : t('timer.active_shift')
            : t('timer.no_running_timer')
          }
        </div>

        <QuickKundeSelect 
          value={timer.currentKundeId} 
          onChange={(val) => {
            useTimerStore.setState({ currentKundeId: val });
          }}
          disabled={timer.isActive}
        />

        <TimerButton 
          isActive={timer.isActive} 
          onToggle={handleToggle} 
        />

        <div className="w-full max-w-sm">
          <ActiveEntry 
            isActive={timer.isActive} 
            isPaused={timer.isPaused} 
            onPauseResume={handlePauseResume} 
          />
        </div>

      </div>
    </PageTransition>
  );
};
