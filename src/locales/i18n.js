import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './translations/en';
import { de } from './translations/de';

i18next.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        de: { translation: de },
    },
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});