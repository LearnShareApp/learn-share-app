import * as Localization from "expo-localization";
import en from "./en.json";
import sr from "./sr.json";
import ru from "./ru.json";
import de from "./de.json";

const translations = {
  en,
  sr,
  ru,
  de,
};

export type LanguageCode = keyof typeof translations;

export const getCurrentLanguage = (): LanguageCode => {
  const locale = Localization.locale.split("-")[0] as LanguageCode;
  return translations[locale] ? locale : "en";
};

export const translate = (key: string, language?: LanguageCode): string => {
  const lang = language || getCurrentLanguage();
  return (translations[lang] as Record<string, string>)?.[key] || key;
};

export const changeLanguage = async (language: LanguageCode) => {
  // Здесь можно добавить сохранение выбранного языка в AsyncStorage
  // и использовать его при следующем запуске приложения
};
