
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all English translation files
import enApp from './locales/en/app.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enSpecialties from './locales/en/specialties.json';
import enLectures from './locales/en/lectures.json';
import enQuestions from './locales/en/questions.json';
import enAdmin from './locales/en/admin.json';
import enProfile from './locales/en/profile.json';
import enSettings from './locales/en/settings.json';
import enCommon from './locales/en/common.json';
import enSidebar from './locales/en/sidebar.json';

// Import all French translation files
import frApp from './locales/fr/app.json';
import frAuth from './locales/fr/auth.json';
import frDashboard from './locales/fr/dashboard.json';
import frSpecialties from './locales/fr/specialties.json';
import frLectures from './locales/fr/lectures.json';
import frQuestions from './locales/fr/questions.json';
import frAdmin from './locales/fr/admin.json';
import frProfile from './locales/fr/profile.json';
import frSettings from './locales/fr/settings.json';
import frCommon from './locales/fr/common.json';
import frSidebar from './locales/fr/sidebar.json';

// Combine all translation files into namespaces
const resources = {
  en: {
    app: enApp,
    auth: enAuth,
    dashboard: enDashboard,
    specialties: enSpecialties,
    lectures: enLectures,
    questions: enQuestions,
    admin: enAdmin,
    profile: enProfile,
    settings: enSettings,
    common: enCommon,
    sidebar: enSidebar
  },
  fr: {
    app: frApp,
    auth: frAuth,
    dashboard: frDashboard,
    specialties: frSpecialties,
    lectures: frLectures,
    questions: frQuestions,
    admin: frAdmin,
    profile: frProfile,
    settings: frSettings,
    common: frCommon,
    sidebar: frSidebar
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Set English as default language
    fallbackLng: 'en',
    defaultNS: 'app', // Default namespace
    fallbackNS: 'common', // Fallback namespace
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
