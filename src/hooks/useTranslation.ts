import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguageStore } from '../store/useLanguageStore';
import { useEffect, useState } from 'react';
import i18n from '../locales/i18n';

export function useTranslation() {
  const { t, i18n: i18nInstance } = useI18nTranslation();
  const selectedLang = useLanguageStore(state => state.language);
  const [, setTick] = useState(0);

  // Force re-render mechanism for language switch
  useEffect(() => {
    const handleLangChange = () => setTick(t => t + 1);
    i18nInstance.on('languageChanged', handleLangChange);
    return () => {
      i18nInstance.off('languageChanged', handleLangChange);
    };
  }, [i18nInstance]);

  // Sync state with i18next
  useEffect(() => {
    if (selectedLang === 'system') {
      const browserLang = navigator.language.split('-')[0];
      if (i18nInstance.language !== browserLang) {
        i18nInstance.changeLanguage(browserLang);
      }
    } else {
      if (i18nInstance.language !== selectedLang) {
        i18nInstance.changeLanguage(selectedLang);
      }
    }
  }, [selectedLang, i18nInstance]);

  return { t, i18n: i18nInstance, currentLanguage: selectedLang };
}
