import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

console.log('Axios baseURL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (!config.headers) config.headers = {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  thumbnailUrl?: string;
  author: { id: string; name: string };
  publishedAt: string;
}

export const getArticles = async (): Promise<Article[]> => {
  const response = await api.get<Article[]>('/articles');
  return response.data;
};

export const getArticleById = async (
  id: number
): Promise<Article> => {
  const response = await api.get<Article>(`/articles/${id}`);
  return response.data;
};
