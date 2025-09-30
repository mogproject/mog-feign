import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { default as English } from './en';
import { default as Japanese } from './ja';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: English },
      ja: { translation: Japanese },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: { escapeValue: false },
  });

export default i18n;
