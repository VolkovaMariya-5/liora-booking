import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// NextAuth v5 конфиг — экспортируем handlers для API route и auth() для серверных компонентов
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Credentials Provider — вход по email + пароль через NestJS API
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Отправляем email+пароль на NestJS — там passport-local проверяет credentials
          const { data } = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          // NestJS возвращает { user, accessToken }
          // NextAuth сохранит это в JWT сессии
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.accessToken,
          };
        } catch {
          // NestJS вернул 401 — неверные credentials
          return null;
        }
      },
    }),

    // Google OAuth Provider — только если настроены credentials
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
  ],

  callbacks: {
    // jwt callback — вызывается при создании/обновлении JWT токена NextAuth
    // Сохраняем наши кастомные поля: accessToken (от NestJS) и role
    async jwt({ token, user, account }) {
      if (user) {
        // При первом входе user содержит данные из authorize() или Google profile
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }

      // При входе через Google — вызываем NestJS для создания/нахождения пользователя
      if (account?.provider === 'google' && token.email) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/google`, {
            email: token.email,
            name: token.name,
          });
          token.id = data.user.id;
          token.role = data.user.role;
          token.accessToken = data.accessToken;
        } catch {
          // если NestJS недоступен — логируем но не ломаем
          console.error('Ошибка при создании пользователя через Google');
        }
      }

      return token;
    },

    // session callback — прокидывает данные из JWT токена в объект сессии
    // session доступен в компонентах через useSession() и auth()
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    // Кастомные страницы вместо стандартных NextAuth
    signIn: '/auth/login',
    error: '/auth/login', // ошибки OAuth тоже перенаправляем на логин
  },

  // Используем JWT стратегию (не database sessions) — токен хранится в httpOnly cookie
  session: { strategy: 'jwt' },
});
