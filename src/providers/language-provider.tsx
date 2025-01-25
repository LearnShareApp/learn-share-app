import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageCode, translate, changeLanguage, loadSavedLanguage } from "../locales";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    loadSavedLanguage().then(setLanguageState);
  }, []);

  const setLanguage = async (newLanguage: LanguageCode) => {
    await changeLanguage(newLanguage);
    setLanguageState(newLanguage);
  };

  const t = (key: string) => translate(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
