import { MMKV } from "react-native-mmkv";

// Создаем инстанс хранилища
export const storage = new MMKV();

// Утилиты для работы с токеном
export const tokenStorage = {
  // Сохранить токен
  saveToken: (token: string) => {
    storage.set("userToken", token);
  },

  // Получить токен
  getToken: () => {
    return storage.getString("userToken");
  },

  // Удалить токен
  removeToken: () => {
    storage.delete("userToken");
  },

  // Проверить есть ли токен
  hasToken: () => {
    return storage.contains("userToken");
  },
};
