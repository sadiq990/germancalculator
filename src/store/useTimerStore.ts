import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  startTime: string | null;
  totalPausedMs: number;
  lastPausedAt: string | null;
  currentKundeId: string | null;
  currentProjektId: string | null;
  currentAufgabeId: string | null;
  startTimer: (kundeId?: string | null) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      isActive: false,
      isPaused: false,
      startTime: null,
      totalPausedMs: 0,
      lastPausedAt: null,
      currentKundeId: null,
      currentProjektId: null,
      currentAufgabeId: null,

      startTimer: (kundeId) => set({
        isActive: true,
        isPaused: false,
        startTime: new Date().toISOString(),
        totalPausedMs: 0,
        lastPausedAt: null,
        currentKundeId: kundeId || null
      }),
      stopTimer: () => set({
        isActive: false,
        isPaused: false,
        startTime: null,
        totalPausedMs: 0,
        lastPausedAt: null
      }),
      pauseTimer: () => set({
        isPaused: true,
        lastPausedAt: new Date().toISOString()
      }),
      resumeTimer: () => set((state) => {
        if (!state.lastPausedAt) return state;
        const pauseDuration = new Date().getTime() - new Date(state.lastPausedAt).getTime();
        return {
          isPaused: false,
          totalPausedMs: state.totalPausedMs + pauseDuration,
          lastPausedAt: null
        };
      }),
      resetTimer: () => set({
        isActive: false,
        isPaused: false,
        startTime: null,
        totalPausedMs: 0,
        lastPausedAt: null,
        currentKundeId: null,
        currentProjektId: null,
        currentAufgabeId: null,
      })
    }),
    { name: 'timer-storage' }
  )
);
