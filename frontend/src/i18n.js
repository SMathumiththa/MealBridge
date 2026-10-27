import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en.json";
import taTranslations from "./locales/ta.json";
import siTranslations from "./locales/si.json";

// Set up the resources object
const resources = {
  en: { translation: enTranslations },
  ta: { translation: taTranslations },
  si: { translation: siTranslations }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("language") || "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
