// providers/auth-provider.tsx
import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "../../assets/types/user";

interface AuthContextType {
  token: string | null;
  user: User | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Загружаем токен при инициализации
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("userToken");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading token:", error);
    }
  };

  const signIn = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync("userToken", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      setToken(null);
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
