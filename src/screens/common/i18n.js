import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; 
import enTranslation from '../../../assets/locales/en.json';
import arTranslation from '../../../assets/locales/hi.json';
import tmTranslation from '../../../assets/locales/tm.json'
import tlTranslation from '../../../assets/locales/tl.json'

// console.log("tm", tmTranslation);


i18n.use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      tm:{
        translation:tmTranslation
      },
      ar: {
        translation: arTranslation,
      },
      tl:{
        translation:tlTranslation

      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
