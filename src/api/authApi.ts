import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface UserInfo {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await authApi.post<{ data: AuthResponse; message: string }>('/login', data);
  return response.data.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await authApi.post<{ data: AuthResponse; message: string }>('/register', data);
  return response.data.data;
};

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await authApi.get<{ data: UserInfo; message: string }>('/userinfo');
  return response.data.data;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const setUserInfo = (user: AuthResponse['user']) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserInfoFromStorage = (): AuthResponse['user'] | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const removeUserInfo = () => {
  localStorage.removeItem('user');
};

export default authApi;
