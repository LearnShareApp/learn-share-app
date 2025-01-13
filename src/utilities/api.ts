import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Базовая конфигурация Axios
const apiClient = axios.create({
  baseURL: "https://your-api-url.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавление интерцептора для авторизации
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ошибок (опционально)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;

/*
import apiClient from './utils/api';

const fetchUserData = async () => {
  try {
    const response = await apiClient.get('/user'); // Укажите нужный эндпоинт
    console.log('User data:', response.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};




const loginUser = async (email, password) => {
  try {
    const payload = { email, password };
    const response = await apiClient.post('/auth/login', payload); // Укажите нужный эндпоинт
    console.log('Login successful:', response.data);

    // Сохранение токена в Secure Store
    await SecureStore.setItemAsync('authToken', response.data.token);
  } catch (error) {
    console.error('Error during login:', error);
  }
};
*/
