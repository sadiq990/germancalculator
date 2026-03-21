// ══════════════════════════════════════════════════
// FILE: src/locales/i18n.ts
// PURPOSE: i18next configuration with auto-detection and plug-and-play locale support
// ══════════════════════════════════════════════════

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedLocale } from '@core/types/models';
import { STORAGE_KEYS } from '@core/storage/storageKeys';

import de from './de.json';
import en from './en.json';
import fr from './fr.json';
import tr from './tr.json';

export interface LocaleConfig {
  code: SupportedLocale;
  label: string;
  flag: string;
}

// Plug-and-play: adding a new locale requires only:
// 1. New JSON file in /locales
// 2. Add to SupportedLocale type in models.ts
// 3. Add entry here
// 4. Import JSON above & add to resources below
export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

const SUPPORTED_LOCALE_CODES: readonly SupportedLocale[] = SUPPORTED_LOCALES.map((l) => l.code);

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALE_CODES as readonly string[]).includes(locale);
}

/**
 * Determines the initial language using priority order:
 * 1. User-selected language (stored in AsyncStorage)
 * 2. Device language (expo-localization)
 * 3. Fallback: 'de' (primary market)
 */
async function detectLanguage(): Promise<SupportedLocale> {
  // Priority 1: User-selected language
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCALE);
    if (stored !== null && isSupportedLocale(stored)) {
      return stored;
    }
  } catch {
    // Storage unavailable, fall through
  }

  // Priority 2: Device language
  const deviceLocales = Localization.getLocales();
  if (deviceLocales.length > 0) {
    const deviceLang = deviceLocales[0]?.languageCode ?? null;
    if (deviceLang !== null && isSupportedLocale(deviceLang)) {
      return deviceLang;
    }
  }

  // Priority 3: Fallback
  return 'de';
}

let i18nInitialized = false;

export async function initI18n(): Promise<void> {
  if (i18nInitialized) return;

  const detectedLanguage = await detectLanguage();

  await i18n.use(initReactI18next).init({
    resources: {
      de: { translation: de },
      en: { translation: en },
      fr: { translation: fr },
      tr: { translation: tr },
    },
    lng: detectedLanguage,
    fallbackLng: 'de',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    react: {
      useSuspense: false,
    },
  });

  i18nInitialized = true;
}

export async function changeLanguage(locale: SupportedLocale): Promise<void> {
  await i18n.changeLanguage(locale);
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_LOCALE, locale);
  } catch {
    // Non-fatal: language still changed in memory
  }
}

export default i18n;
