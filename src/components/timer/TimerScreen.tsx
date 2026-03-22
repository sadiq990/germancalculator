import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, Plus, Zap } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';
import { useTranslation } from '../../hooks/useTranslation';
import { TimerDisplay } from './TimerDisplay';
import { TimerButton } from './TimerButton';
import { QuickKundeSelect } from './QuickKundeSelect';
import { ActiveEntry } from './ActiveEntry';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const TimerScreen: React.FC = () => {
  const { t } = useTranslation();
  const { status, startTime, elapsedTime, startTimer, stopTimer, pauseTimer, resumeTimer } = useTimerStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 max-w-2xl mx-auto w-full py-4"
    >
      {/* Visual Header */}
      <div className="flex flex-col gap-1 px-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          {t('timer.title', 'Working Time')}
        </h1>
        <p className="text-neutral-500 dark:text-ios-gray-2 text-lg">
          {status === 'running' ? t('timer.status_running', 'Session is active') : t('timer.status_idle', 'Ready to start tracking')}
        </p>
      </div>

      {/* Main Timer Display */}
      <Card className="p-8 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center gap-10 shadow-ios-hover glass-heavy rounded-ios-xl border-none">
        {/* Animated Background Pulse */}
        <AnimatePresence>
          {status === 'running' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.05 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
              className="absolute inset-0 bg-ios-blue rounded-full pointer-events-none"
            />
          )}
        </AnimatePresence>

        <TimerDisplay 
          elapsedTime={elapsedTime} 
          status={status}
          className="text-7xl sm:text-8xl font-mono font-semibold tracking-tight text-ios-blue group-hover:scale-105 transition-transform" 
        />
        
        <div className="w-full flex justify-center items-center scale-110 sm:scale-125 py-4">
          <TimerButton />
        </div>
      </Card>

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        <ActiveEntry />
        <QuickKundeSelect />
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="ghost" className="rounded-full px-6 py-3 bg-white dark:bg-ios-dark-4 shadow-sm flex items-center gap-2 text-sm font-semibold">
          <Plus size={18} />
          {t('timer.manual_entry', 'Manual Entry')}
        </Button>
        <Button variant="ghost" className="rounded-full px-6 py-3 bg-ios-blue/10 text-ios-blue shadow-none flex items-center gap-2 text-sm font-semibold">
          <Zap size={18} />
          {t('timer.quick_start', 'Quick Start')}
        </Button>
      </div>
    </motion.div>
  );
};
