import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Получаем accessToken из NextAuth v5 через прямой запрос к /api/auth/session
// (getSession() из next-auth/react в v5 не возвращает кастомные поля)
async function getAccessToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/session');
    if (!res.ok) return null;
    const session = await res.json();
    return (session?.accessToken as string) ?? null;
  } catch {
    return null;
  }
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
