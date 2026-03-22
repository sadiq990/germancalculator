// ══════════════════════════════════════════════════
// FILE: src/core/storage/workHoursRepository.ts
// PURPOSE: Repository for WorkSession persistence — all AsyncStorage I/O isolated here
// ══════════════════════════════════════════════════

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WorkSession } from '@core/types/models';
import { STORAGE_KEYS } from './storageKeys';

function isWorkSession(value: unknown): value is WorkSession {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['startTime'] === 'number' &&
    (v['endTime'] === null || typeof v['endTime'] === 'number') &&
    (v['durationMinutes'] === null || typeof v['durationMinutes'] === 'number') &&
    (v['note'] === null || typeof v['note'] === 'string') &&
    (v['employerId'] === null || typeof v['employerId'] === 'string') &&
    typeof v['createdAt'] === 'number' &&
    typeof v['updatedAt'] === 'number'
  );
}

function parseSessionsFromStorage(raw: string | null): WorkSession[] {
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWorkSession);
  } catch {
    return [];
  }
}

let writeQueue: Promise<void> = Promise.resolve();

async function enqueueWrite<T>(op: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(op);
  writeQueue = result.then(() => {}).catch(() => {});
  return result;
}

export const workHoursRepository = {
  async getAllSessions(): Promise<WorkSession[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    return parseSessionsFromStorage(raw);
  },

  async saveSession(session: WorkSession): Promise<void> {
    return enqueueWrite(async () => {
      const sessions = await workHoursRepository.getAllSessions();
      const existingIndex = sessions.findIndex((s) => s.id === session.id);
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      // Sort by startTime descending for consistent ordering
      sessions.sort((a, b) => b.startTime - a.startTime);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    });
  },

  async deleteSession(id: string): Promise<void> {
    return enqueueWrite(async () => {
      const sessions = await workHoursRepository.getAllSessions();
      const filtered = sessions.filter((s) => s.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
    });
  },

  async getActiveSessionId(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
  },

  async setActiveSessionId(id: string | null): Promise<void> {
    if (id === null) {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
    }
  },

  async clearAllSessions(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SESSIONS,
      STORAGE_KEYS.ACTIVE_SESSION_ID,
    ]);
  },

  async getSessionById(id: string): Promise<WorkSession | null> {
    const sessions = await workHoursRepository.getAllSessions();
    return sessions.find((s) => s.id === id) ?? null;
  },

  async exportAllAsJSON(): Promise<string> {
    const sessions = await workHoursRepository.getAllSessions();
    return JSON.stringify({ version: 1, sessions, exportedAt: Date.now() }, null, 2);
  },

  async importFromJSON(json: string): Promise<void> {
    const parsed: unknown = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid backup format');
    }
    const obj = parsed as Record<string, unknown>;
    if (!Array.isArray(obj['sessions'])) {
      throw new Error('Invalid backup format: missing sessions');
    }
    const sessions = obj['sessions'].filter(isWorkSession);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  async getPdfExportCount(): Promise<number> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PDF_EXPORT_COUNT);
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  },

  async incrementPdfExportCount(): Promise<number> {
    const current = await workHoursRepository.getPdfExportCount();
    const next = current + 1;
    await AsyncStorage.setItem(STORAGE_KEYS.PDF_EXPORT_COUNT, String(next));
    return next;
  },
} as const;
