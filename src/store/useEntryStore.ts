import { create } from 'zustand';
import type { TimeEntry, EntryTemplate } from '../types/entry.types';
import { db } from '../utils/storageUtils';

interface EntryState {
  entries: TimeEntry[];
  templates: EntryTemplate[];
  loadEntries: () => Promise<void>;
  addEntry: (entry: TimeEntry) => Promise<void>;
  updateEntry: (id: string, entry: Partial<TimeEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useEntryStore = create<EntryState>((set, get) => ({
  entries: [],
  templates: [],
  loadEntries: async () => {
    const entries = await db.entries.toArray();
    const templates = await db.templates.toArray();
    set({ entries, templates });
  },
  addEntry: async (entry) => {
    await db.entries.add(entry);
    await get().loadEntries();
  },
  updateEntry: async (id, changes) => {
    await db.entries.update(id, changes);
    await get().loadEntries();
  },
  deleteEntry: async (id) => {
    await db.entries.delete(id);
    await get().loadEntries();
  }
}));
