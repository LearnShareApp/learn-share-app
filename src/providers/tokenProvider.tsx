import React, { createContext, useState, useContext, ReactNode } from "react";

// Определяем типы для контекста
interface TokenContextType {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

// Создаем контекст с типом
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Определяем тип для пропсов провайдера
interface TokenProviderProps {
  children: ReactNode;
}

// Провайдер контекста
export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>("");

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Хук для использования контекста
export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
