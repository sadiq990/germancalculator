import { useEffect } from 'react';
import { useTimerStore } from '../store/useTimerStore';
import { useEntryStore } from '../store/useEntryStore';
import { getTodayStr } from '../utils/dateUtils';

export function useTimer() {
  const timer = useTimerStore();
  const addEntry = useEntryStore(state => state.addEntry);

  useEffect(() => {
    // Optional logic to update title badge etc based on timer tick
  }, [timer.isActive, timer.isPaused]);

  const handleStop = async () => {
    if (!timer.startTime) return;
    const endTime = new Date().toISOString();
    
    const startMs = new Date(timer.startTime).getTime();
    const endMs = new Date(endTime).getTime();
    const durationMin = Math.round((endMs - startMs - timer.totalPausedMs) / 60000);

    const newEntry = {
      id: crypto.randomUUID(),
      date: getTodayStr(),
      startTime: new Date(timer.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      endTime: new Date(endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      duration: Math.max(0, durationMin),
      isOvernight: false, 
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      kundeId: timer.currentKundeId,
      projektId: timer.currentProjektId,
      aufgabeId: timer.currentAufgabeId,
      note: '',
      customAttributes: [],
      type: 'work' as const,
      isPaid: false,
      isInvoiced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await addEntry(newEntry);
    timer.stopTimer();
  };

  return {
    ...timer,
    stopAndSave: handleStop
  };
}
