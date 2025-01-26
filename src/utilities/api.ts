// services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const BACKEND_URL = "http://192.168.1.8:81";

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

export interface AddTimeData {
  datetime: Date;
}

export interface LessonRequestData {
  teacher_id: number;
  category_id: number;
  schedule_time_id: number;
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

export interface DateTime {
  datetime: Date;
  is_available: boolean;
  schedule_time_id: number;
}
export interface TimesResponse {
  datetimes: DateTime[];
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  surname: string;
  birthdate: string;
}

export interface TeacherSkill {
  about: string;
  category_id: number;
  category_name: string;
  rate: number;
  skill_id: number;
  video_card_link: string;
}

export interface TeacherProfile {
  user_id: number;
  teacher_id: number;
  registration_date: Date;
  email: string;
  name: string;
  surname: string;
  birthdate: string;
  skills: TeacherSkill[];
}

export interface TeacherLesson {
  lesson_id: number;
  student_id: number;
  student_name: string;
  student_surname: string;
  category_id: number;
  category_name: string;
  status: string;
  datetime: Date;
  token: string;
}

export interface Lesson {
  lesson_id: number;
  teacher_id: number;
  teacher_name: string;
  teacher_surname: string;
  category_id: number;
  category_name: string;
  status: string;
  datetime: Date;
  token: string;
}

export interface TeacherLessonResponse {
  lessons: TeacherLesson[];
}

export interface LessonResponse {
  lessons: Lesson[];
}

export interface TeachersResponse {
  teachers: TeacherProfile[];
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

  async addTime(data: AddTimeData): Promise<String> {
    const response = await this.api.post("/api/teacher/schedule", data);
    return response.statusText;
  }

  async getTime(): Promise<DateTime[]> {
    const response = await this.api.get<TimesResponse>("/api/teacher/schedule");
    return response.data.datetimes;
  }

  async getTimeById(id: string): Promise<DateTime[]> {
    const response = await this.api.get<TimesResponse>(
      `/api/teachers/${id}/schedule`
    );
    return response.data.datetimes;
  }

  async lessonRequest(data: LessonRequestData): Promise<String> {
    const response = await this.api.post("/api/lesson", data);
    return response.statusText;
  }

  async lessonApprove(id: number): Promise<String> {
    const response = await this.api.put(`/api/lessons/${id}/approve`);
    return response.statusText;
  }

  async lessonCancel(id: number): Promise<String> {
    const response = await this.api.put(`/api/lessons/${id}/cancel`);
    return response.statusText;
  }

  async lessonFinish(id: number): Promise<String> {
    const response = await this.api.put(`/api/lessons/${id}/finish`);
    return response.statusText;
  }

  async lessonStart(id: number): Promise<String> {
    const response = await this.api.put(`/api/lessons/${id}/start`);
    return response.statusText;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<CategoriesResponse>("/api/categories");
    return response.data.categories;
  }

  async getUserProfile(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>("/api/user/profile");
    return response.data;
  }

  async getTeacherProfile(): Promise<TeacherProfile> {
    const response = await this.api.get<TeacherProfile>("/api/teacher");
    return response.data;
  }

  async getTeacherLessons(): Promise<TeacherLesson[]> {
    const response = await this.api.get<TeacherLessonResponse>(
      "/api/teacher/lessons"
    );
    return response.data.lessons;
  }

  async getLessons(): Promise<Lesson[]> {
    const response = await this.api.get<LessonResponse>("/api/lessons");
    return response.data.lessons;
  }

  async getTeachers(): Promise<TeacherProfile[]> {
    const response = await this.api.get<TeachersResponse>("/api/teachers");
    return response.data.teachers || [];
  }

  async getTeacherById(id: string): Promise<TeacherProfile> {
    const response = await this.api.get<TeacherProfile>(`/api/teachers/${id}`);
    return response.data;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request<T>(config);
    return response.data;
  }
}

export const apiService = new ApiService();
