import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from './locales/en.json';
import viLocale from './locales/vi.json';

export const resources = {
  en: { translation: enLocale },
  vi: { translation: viLocale }
};

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('locale') || 'vi',
  resources,
});

export default i18n;
