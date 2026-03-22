import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'de' | 'en' | 'tr' | 'fr' | 'it' | 'system';
  setLanguage: (lang: 'de' | 'en' | 'tr' | 'fr' | 'it' | 'system') => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'system',
      setLanguage: (lang) => set({ language: lang })
    }),
    { name: 'language-storage' }
  )
);
