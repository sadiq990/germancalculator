import { create } from 'zustand';
import type { Sondertag } from '../types/sondertag.types';
import { db } from '../utils/storageUtils';

interface SondertagState {
  sondertage: Sondertag[];
  loadSondertage: () => Promise<void>;
  addSondertag: (s: Sondertag) => Promise<void>;
  deleteSondertag: (id: string) => Promise<void>;
}

export const useSondertagStore = create<SondertagState>((set, get) => ({
  sondertage: [],
  loadSondertage: async () => {
    const list = await db.sondertage.toArray();
    set({ sondertage: list });
  },
  addSondertag: async (s) => {
    await db.sondertage.add(s);
    await get().loadSondertage();
  },
  deleteSondertag: async (id) => {
    await db.sondertage.delete(id);
    await get().loadSondertage();
  }
}));
