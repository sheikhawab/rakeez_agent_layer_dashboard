import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEn from './locales/en/common.json'
import commonAr from './locales/ar/common.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: commonEn },
      ar: { common: commonAr },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mithasii-language',
    },
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
})

// Apply initial direction on load
if (typeof document !== 'undefined') {
  const initialLng = i18n.language || 'en'
  document.documentElement.lang = initialLng
  document.documentElement.dir = initialLng === 'ar' ? 'rtl' : 'ltr'
}

export default i18n
