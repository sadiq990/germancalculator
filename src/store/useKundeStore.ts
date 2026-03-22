import { create } from 'zustand';
import type { Kunde, Projekt, Aufgabe } from '../types/kunde.types';
import { db } from '../utils/storageUtils';

interface KundeState {
  kunden: Kunde[];
  projekte: Projekt[];
  aufgaben: Aufgabe[];
  loadData: () => Promise<void>;
  addKunde: (k: Kunde) => Promise<void>;
  addProjekt: (p: Projekt) => Promise<void>;
  addAufgabe: (a: Aufgabe) => Promise<void>;
}

export const useKundeStore = create<KundeState>((set, get) => ({
  kunden: [],
  projekte: [],
  aufgaben: [],
  loadData: async () => {
    const k = await db.kunden.toArray();
    const p = await db.projekte.toArray();
    const a = await db.aufgaben.toArray();
    set({ kunden: k, projekte: p, aufgaben: a });
  },
  addKunde: async (k) => {
    await db.kunden.add(k);
    await get().loadData();
  },
  addProjekt: async (p) => {
    await db.projekte.add(p);
    await get().loadData();
  },
  addAufgabe: async (a) => {
    await db.aufgaben.add(a);
    await get().loadData();
  }
}));
