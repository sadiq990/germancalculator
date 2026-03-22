import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaxInput } from '../types/tax.types';

interface TaxState {
  taxProfile: TaxInput;
  updateTaxProfile: (updates: Partial<TaxInput>) => void;
}

const defaultTaxProfile: TaxInput = {
  bruttoMonthly: 3000,
  steuerklasse: 'I',
  kirchensteuer: false,
  kirchensteuerSatz: 0.09,
  kvBeitragssatz: 0.163, // 14.6 + 1.7 Zusatz
  bundesland: 'BE',
  hasKinder: false,
  kinderanzahl: 0,
  isMiniJob: false,
  isMidiJob: false
};

export const useTaxStore = create<TaxState>()(
  persist(
    (set) => ({
      taxProfile: defaultTaxProfile,
      updateTaxProfile: (updates) => set((state) => ({
        taxProfile: { ...state.taxProfile, ...updates }
      }))
    }),
    { name: 'tax-storage' }
  )
);
