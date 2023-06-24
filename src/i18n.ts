import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  // Add more...
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language if translation is missing
  interpolation: {
    escapeValue: false, // React already escapes strings by default
  },
});

export default i18n;
