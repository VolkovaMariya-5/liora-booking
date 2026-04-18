import { DefaultSession, DefaultJWT } from 'next-auth';

// Расширяем стандартные типы NextAuth — добавляем наши поля
// Без этого TypeScript не знает о accessToken и role в сессии
declare module 'next-auth' {
  interface Session {
    // JWT токен от NestJS — нужен для авторизованных запросов к API
    accessToken?: string;
    user: DefaultSession['user'] & {
      id: string;
      role: string; // SUPER_ADMIN | BUSINESS_ADMIN | STAFF | CLIENT
    };
  }

  interface User {
    id: string;
    role: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    role?: string;
    id?: string;
  }
}
