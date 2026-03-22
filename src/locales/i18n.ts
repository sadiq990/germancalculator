import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './de.json';
import en from './en.json';
import tr from './tr.json';
import fr from './fr.json';
import it from './it.json';

const resources = {
  de: { translation: de },
  en: { translation: en },
  tr: { translation: tr },
  fr: { translation: fr },
  it: { translation: it }
};

const savedLang = localStorage.getItem('language-storage');
let parsedLang = 'de';
if (savedLang) {
  try {
    const state = JSON.parse(savedLang);
    if (state?.state?.language && state.state.language !== 'system') {
      parsedLang = state.state.language;
    } else {
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang && resources[browserLang as keyof typeof resources]) {
        parsedLang = browserLang;
      }
    }
  } catch (e) {
    // fallback
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: parsedLang,
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
