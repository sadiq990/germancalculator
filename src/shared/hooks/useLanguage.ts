// ══════════════════════════════════════════════════
// FILE: src/shared/hooks/useLanguage.ts
// PURPOSE: Custom hook to ensure components re-render on language changes
// ══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@locales/i18n';

/**
 * Custom hook that ensures components re-render when language changes.
 * This is a wrapper around useTranslation that adds explicit language tracking.
 * Use this instead of useTranslation when you need guaranteed re-renders on language change.
 */
export function useLanguage() {
  const { t, i18n: i18nInstance } = useTranslation();
  const [language, setLanguage] = useState<string>(i18nInstance.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return { t, language };
}
