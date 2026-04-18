import axios from 'axios';
import { getSession } from 'next-auth/react';

// Базовый URL бэкенда из переменной окружения
// NEXT_PUBLIC_ — доступен на клиенте (в браузере) и на сервере
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Создаём единственный экземпляр axios для всего приложения
// Все запросы к API будут идти через этот экземпляр
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — добавляет JWT токен в каждый запрос автоматически
// Благодаря этому не нужно вручную передавать токен в каждый вызов api
api.interceptors.request.use(async (config) => {
  // getSession() возвращает текущую NextAuth сессию с токеном
  const session = await getSession();
  if (session?.accessToken) {
    // Bearer — стандартный способ передачи JWT токена в HTTP заголовке
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Response interceptor — обрабатывает ошибки централизованно
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если сервер вернул 401 (не авторизован) — токен устарел или не валиден
    if (error.response?.status === 401) {
      // В браузере перенаправляем на страницу входа
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    // Пробрасываем ошибку дальше, чтобы компоненты могли её обработать
    return Promise.reject(error);
  },
);
