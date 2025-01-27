import * as Localization from "expo-localization";
import en from "./en.json";
import sr from "./sr.json";
import ru from "./ru.json";
import de from "./de.json";
import fr from "./fr.json";

import * as SecureStore from "expo-secure-store";

const translations = {
  en,
  sr,
  ru,
  de,
  fr,
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
  try {
    await SecureStore.setItemAsync("selectedLanguage", language);
  } catch (error) {
    console.error("Error saving language:", error);
  }
};

export const loadSavedLanguage = async (): Promise<LanguageCode> => {
  try {
    const savedLanguage = await SecureStore.getItemAsync("selectedLanguage");
    if (savedLanguage && translations[savedLanguage as LanguageCode]) {
      return savedLanguage as LanguageCode;
    }
  } catch (error) {
    console.error("Error loading language:", error);
  }
  return getCurrentLanguage();
};
