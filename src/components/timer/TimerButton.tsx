import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, StopCircle } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';

export const TimerButton: React.FC = () => {
  const { status, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimerStore();

  const handleToggle = () => {
    if (status === 'idle') startTimer();
    else if (status === 'running') pauseTimer();
    else if (status === 'paused') resumeTimer();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all shadow-ios-hover shadow-ios-glass relative z-10
          ${status === 'running' 
            ? 'bg-ios-orange text-white ring-4 ring-ios-orange/20' 
            : 'bg-ios-blue text-white ring-4 ring-ios-blue/20'
          }
        `}
      >
        <AnimatePresence mode="wait">
          {status === 'running' ? (
            <motion.div
              key="pause"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Pause size={48} fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Play size={48} fill="currentColor" strokeWidth={1} className="ml-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {status !== 'idle' && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={stopTimer}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-ios-red/10 text-ios-red font-bold text-sm tracking-wide uppercase"
        >
          <StopCircle size={20} />
          Finish
        </motion.button>
      )}
    </div>
  );
};
