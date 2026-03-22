import React, { useEffect, useState } from 'react';

interface TimerDisplayProps {
  isActive: boolean;
  isPaused: boolean;
  startTime: string | null;
  totalPausedMs: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ isActive, isPaused, startTime, totalPausedMs }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isActive && !isPaused && startTime) {
      interval = window.setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        setElapsed(now - start - totalPausedMs);
      }, 1000);
    } else if (isActive && isPaused && startTime) {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      setElapsed(now - start - totalPausedMs);
    } else {
      setElapsed(0);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime, totalPausedMs]);

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const h = Math.floor(elapsed / 3600000);
  const m = Math.floor((elapsed % 3600000) / 60000);
  const s = Math.floor((elapsed % 60000) / 1000);

  return (
    <div className="text-center font-mono tracking-widest tabular-nums text-6xl md:text-8xl font-light text-neutral-900 dark:text-dark-text mt-4 mb-2">
      <span className={isPaused ? 'opacity-50' : ''}>
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
};
