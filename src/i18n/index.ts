
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';

// Import all translation files here
const resources = {
  fr: {
    translation: frTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Set English as default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
