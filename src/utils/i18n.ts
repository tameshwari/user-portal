import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTrans from '../locales/en/translation.json';
import daTrans from '../locales/da/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTrans,
      },
      da: {
        translation: daTrans,
      },
    },
    lng: 'en', 
    fallbackLng: 'en', // Fallback language if key is not found
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
