// services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const BACKEND_URL = "http://192.168.1.8:8080";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData extends LoginData {
  name: string;
  surname: string;
  birthdate: Date;
}

export interface AddSkillData {
  about: string;
  video_card_link: string;
  category_id: number;
}

export interface LoginResponse {
  token: string;
}

export interface Category {
  id: number;
  min_age: number;
  name: string;
}

export interface Skill {
  label: string;
  value: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  surname: string;
  birthdate: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Добавляем перехватчик для установки токена авторизации
    this.api.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/api/auth/login",
      data
    );
    return response.data;
  }

  async signUp(data: SignUpData): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/api/auth/signup",
      data
    );
    return response.data;
  }

  async addSkill(data: AddSkillData): Promise<String> {
    const response = await this.api.post("/api/teacher/skill", data);
    return response.statusText;
  }

  // Categories endpoints
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<CategoriesResponse>("/api/categories");
    return response.data.categories;
  }

  // User profile endpoints
  async getUserProfile(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>("/api/user/profile");
    return response.data;
  }

  // Общий метод для выполнения запросов
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request<T>(config);
    return response.data;
  }
}

// Создаем и экспортируем единственный экземпляр сервиса
export const apiService = new ApiService();
