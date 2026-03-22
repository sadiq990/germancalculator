// ══════════════════════════════════════════════════
// FILE: src/store/timerStore.ts
// PURPOSE: Zustand timer store — all state, no AsyncStorage calls (repo layer only)
// ══════════════════════════════════════════════════

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import * as Crypto from 'expo-crypto';
import { startOfDay, isSameDay, getMonth, getYear } from 'date-fns';
import type { WorkSession } from '@core/types/models';
import { workHoursRepository } from '@core/storage/workHoursRepository';
import { analyticsService } from '@core/services/analyticsService';
import { hasOverlap } from '@shared/utils/validationUtils';
import type { TimerPhase } from '@core/types/models';

export interface TimerStore {
  // State
  activeSession: WorkSession | null;
  sessions: WorkSession[];
  isRunning: boolean;
  timerPhase: TimerPhase;
  elapsedSeconds: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  startSession: () => Promise<void>;
  stopSession: () => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  addManualSession: (startTime: number, endTime: number, note?: string) => Promise<void>;
  updateSession: (id: string, changes: { startTime?: number; endTime?: number; note?: string }) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  updateSessionNote: (id: string, note: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  restoreActiveSession: () => Promise<boolean>;
  clearError: () => void;
  setElapsedSeconds: (seconds: number) => void;
  discardActiveSession: () => Promise<void>;

  // Computed methods
  getSessionsForDate: (date: Date) => WorkSession[];
  getSessionsForMonth: (month: number, year: number) => WorkSession[];
  getTodayTotalMinutes: () => number;
  getMonthTotalMinutes: (month: number, year: number) => number;
  checkSessionOverlap: (startTime: number, endTime: number, excludeId?: string) => WorkSession | null;
}

export const useTimerStore = create<TimerStore>()(
  immer((set, get) => ({
    activeSession: null,
    sessions: [],
    isRunning: false,
    timerPhase: 'idle',
    elapsedSeconds: 0,
    isLoading: false,
    error: null,

    startSession: async () => {
      const { isRunning } = get();
      if (isRunning) return;

      const now = Date.now();
      const id = await Crypto.randomUUID();

      const newSession: WorkSession = {
        id,
        startTime: now,
        endTime: null,
        durationMinutes: null,
        pausedAt: null,
        totalPausedMs: 0,
        note: null,
        employerId: null,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => {
        state.activeSession = newSession;
        state.isRunning = true;
        state.timerPhase = 'running';
        state.elapsedSeconds = 0;
        state.error = null;
      });

      try {
        await workHoursRepository.setActiveSessionId(id);
        await workHoursRepository.saveSession(newSession);
        analyticsService.track({ name: analyticsService.Events.SESSION_STARTED });
      } catch (err) {
        set((state) => {
          state.error = 'errors.storage_write';
          state.activeSession = null;
          state.isRunning = false;
        });
      }
    },

    stopSession: async () => {
      const { activeSession } = get();
      if (activeSession === null) return;

      const now = Date.now();
      const durationMs = now - activeSession.startTime - activeSession.totalPausedMs;
      const durationMinutes = Math.floor(durationMs / 60000);

      // Discard if < 1 minute (accidental tap)
      if (durationMinutes < 1) {
        set((state) => {
          state.activeSession = null;
          state.isRunning = false;
          state.elapsedSeconds = 0;
          state.error = 'errors.session_zero_duration';
        });
        await workHoursRepository.setActiveSessionId(null);
        return;
      }

      const completedSession: WorkSession = {
        ...activeSession,
        endTime: now,
        durationMinutes,
        updatedAt: now,
      };

      set((state) => {
        state.activeSession = null;
        state.isRunning = false;
        state.timerPhase = 'idle';
        state.elapsedSeconds = 0;
        const idx = state.sessions.findIndex((s) => s.id === completedSession.id);
        if (idx >= 0) {
          state.sessions[idx] = completedSession;
        } else {
          state.sessions.unshift(completedSession);
        }
      });

      try {
        await workHoursRepository.saveSession(completedSession);
        await workHoursRepository.setActiveSessionId(null);
        analyticsService.track({
          name: analyticsService.Events.SESSION_STOPPED,
          properties: { durationMinutes },
        });
      } catch (err) {
        set((state) => {
          state.error = 'errors.storage_write';
        });
      }
    },

    pauseSession: async () => {
      const { activeSession, timerPhase } = get();
      if (!activeSession) return;
      if (timerPhase === 'paused') return;

      const now = Date.now();
      const updatedSession = { ...activeSession, pausedAt: now, updatedAt: now };

      set((state) => {
        state.activeSession = updatedSession;
        state.timerPhase = 'paused';
      });

      try {
        await workHoursRepository.saveSession(updatedSession);
        analyticsService.track({ name: 'session_paused' });
      } catch {
        set((state) => { state.error = 'errors.storage_write'; });
      }
    },

    resumeSession: async () => {
      const { activeSession, timerPhase } = get();
      if (!activeSession || activeSession.pausedAt === null || timerPhase !== 'paused') return;

      const now = Date.now();
      const elapsed = now - activeSession.pausedAt;
      const updatedSession = {
        ...activeSession,
        totalPausedMs: activeSession.totalPausedMs + elapsed,
        pausedAt: null,
        updatedAt: now,
      };

      set((state) => {
        state.activeSession = updatedSession;
        state.timerPhase = 'running';
      });

      try {
        await workHoursRepository.saveSession(updatedSession);
        analyticsService.track({ name: 'session_resumed' });
      } catch {
        set((state) => { state.error = 'errors.storage_write'; });
      }
    },

    addManualSession: async (startTime: number, endTime: number, note?: string) => {
      const { sessions } = get();
      if (endTime <= startTime) throw new Error('manual_entry.error_order');
      if (endTime > Date.now()) throw new Error('manual_entry.error_future');
      if (hasOverlap(startTime, endTime, sessions)) throw new Error('manual_entry.error_overlap');

      const now = Date.now();
      const durationMs = endTime - startTime;
      const durationMinutes = Math.floor(durationMs / 60000);
      const id = await Crypto.randomUUID();

      const newSession: WorkSession = {
        id,
        startTime,
        endTime,
        durationMinutes,
        pausedAt: null,
        totalPausedMs: 0,
        note: note ? note.slice(0, 140) : null,
        employerId: null,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => {
        state.sessions.push(newSession);
        state.sessions.sort((a, b) => b.startTime - a.startTime); // keep descending order
      });

      try {
        await workHoursRepository.saveSession(newSession);
      } catch {
        set((state) => {
          state.sessions = state.sessions.filter(s => s.id !== id);
          state.error = 'errors.storage_write';
        });
      }
    },

    updateSession: async (id: string, changes: { startTime?: number; endTime?: number; note?: string }) => {
      const { sessions } = get();
      const existing = sessions.find(s => s.id === id);
      if (!existing) return;

      const isTimeChange = changes.startTime !== undefined || changes.endTime !== undefined;

      // Active session restrictions
      if (existing.endTime === null && isTimeChange) {
        throw new Error('edit_session.active_locked'); // cannot change time of active session
      }

      const newStart = changes.startTime ?? existing.startTime;
      const newEnd = changes.endTime ?? existing.endTime;

      if (newEnd !== null) {
        if (newEnd <= newStart) throw new Error('manual_entry.error_order');
        if (newEnd > Date.now()) throw new Error('manual_entry.error_future');
        if (hasOverlap(newStart, newEnd, sessions, id)) throw new Error('manual_entry.error_overlap');
      }

      const now = Date.now();
      let newDuration: number | null = existing.durationMinutes;

      if (newEnd !== null) {
        const durationMs = newEnd - newStart - existing.totalPausedMs;
        newDuration = Math.max(0, Math.floor(durationMs / 60000));
      }

      const newNote = changes.note !== undefined ? (changes.note ? changes.note.slice(0, 140) : null) : existing.note;
      
      const updatedSession: WorkSession = {
        ...existing,
        startTime: newStart,
        endTime: newEnd,
        durationMinutes: newDuration,
        note: newNote,
        updatedAt: now,
      };

      // update arrays and db
      set((state) => {
        const idx = state.sessions.findIndex(s => s.id === id);
        if (idx >= 0) {
          state.sessions[idx] = updatedSession;
          state.sessions.sort((a, b) => b.startTime - a.startTime);
        }
      });

      try {
        await workHoursRepository.saveSession(updatedSession);
      } catch {
        // Simple rollback if needed
        set((state) => {
          const idx = state.sessions.findIndex(s => s.id === id);
          if (idx >= 0) state.sessions[idx] = existing;
          state.sessions.sort((a, b) => b.startTime - a.startTime);
          state.error = 'errors.storage_write';
        });
      }
    },

    deleteSession: async (id: string) => {
      const prevSessions = get().sessions;
      set((state) => {
        state.sessions = state.sessions.filter((s) => s.id !== id);
      });

      try {
        await workHoursRepository.deleteSession(id);
        analyticsService.track({ name: analyticsService.Events.SESSION_DELETED });
      } catch {
        // Rollback on error
        set((state) => {
          state.sessions = prevSessions;
          state.error = 'errors.storage_write';
        });
      }
    },

    updateSessionNote: async (id: string, note: string) => {
      const trimmed = note.slice(0, 140);
      set((state) => {
        const session = state.sessions.find((s) => s.id === id);
        if (session !== undefined) {
          session.note = trimmed;
          session.updatedAt = Date.now();
        }
      });

      const session = get().sessions.find((s) => s.id === id);
      if (session === undefined) return;

      try {
        await workHoursRepository.saveSession(session);
        analyticsService.track({ name: analyticsService.Events.NOTE_ADDED });
      } catch {
        set((state) => {
          state.error = 'errors.storage_write';
        });
      }
    },

    loadSessions: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const sessions = await workHoursRepository.getAllSessions();
        set((state) => {
          state.sessions = sessions;
          state.isLoading = false;
        });
      } catch {
        set((state) => {
          state.isLoading = false;
          state.error = 'errors.storage_read';
        });
      }
    },

    restoreActiveSession: async () => {
      try {
        const activeId = await workHoursRepository.getActiveSessionId();
        if (activeId === null) return false;

        const session = await workHoursRepository.getSessionById(activeId);
        if (session === null || session.endTime !== null) {
          await workHoursRepository.setActiveSessionId(null);
          return false;
        }

        // Clock sanity check: > 24h means corruption
        const durationMs = Date.now() - session.startTime;
        if (durationMs > 24 * 60 * 60 * 1000) {
          return false; // caller will show warning dialog
        }

        const elapsed = Math.floor(durationMs / 1000);
        set((state) => {
          state.activeSession = session;
          state.isRunning = true;
          state.timerPhase = session.pausedAt !== null ? 'paused' : 'running';
          state.elapsedSeconds = elapsed;
        });

        return true;
      } catch {
        return false;
      }
    },

    discardActiveSession: async () => {
      set((state) => {
        state.activeSession = null;
        state.isRunning = false;
        state.timerPhase = 'idle';
        state.elapsedSeconds = 0;
      });
      await workHoursRepository.setActiveSessionId(null);
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    setElapsedSeconds: (seconds: number) => {
      set((state) => {
        state.elapsedSeconds = seconds;
      });
    },

    // Computed methods — pure, derived from state
    getSessionsForDate: (date: Date) => {
      return get().sessions.filter((s) => isSameDay(new Date(s.startTime), date));
    },

    getSessionsForMonth: (month: number, year: number) => {
      return get().sessions.filter((s) => {
        const d = new Date(s.startTime);
        return getMonth(d) + 1 === month && getYear(d) === year;
      });
    },

    getTodayTotalMinutes: () => {
      const today = startOfDay(new Date());
      return get()
        .sessions.filter(
          (s) => s.durationMinutes !== null && isSameDay(new Date(s.startTime), today),
        )
        .reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0);
    },

    getMonthTotalMinutes: (month: number, year: number) => {
      return get()
        .getSessionsForMonth(month, year)
        .filter((s) => s.durationMinutes !== null)
        .reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0);
    },

    checkSessionOverlap: (startTime: number, endTime: number, excludeId?: string) => {
      const { sessions, activeSession } = get();
      
      // 1. Check completed sessions
      const overlapping = sessions.find((s) => {
        if (s.id === excludeId) return false;
        if (s.endTime === null) return false;
        return startTime < s.endTime && endTime > s.startTime;
      });
      if (overlapping) return overlapping;

      // 2. Check active session (Bug #3 Fix)
      if (activeSession && activeSession.id !== excludeId) {
        const effectiveEnd = activeSession.endTime ?? Date.now();
        if (startTime < effectiveEnd && endTime > activeSession.startTime) {
          return activeSession;
        }
      }

      return null;
    },
  })),
);
