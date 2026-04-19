import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// middleware.ts — выполняется при каждом запросе к защищённым маршрутам
// NextAuth v5 экспортирует auth() как middleware-обёртку

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const path = nextUrl.pathname;

  // ==================== Публичные маршруты ====================
  // Эти маршруты доступны всем без авторизации
  const publicPaths = ['/', '/businesses', '/auth/login', '/auth/register', '/auth/register-business'];
  const isPublicPath = publicPaths.some((p) => path === p || path.startsWith(p));

  // /api/auth/* — NextAuth системные маршруты, всегда пропускаем
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // ==================== Редирект неавторизованных ====================
  if (!isLoggedIn && !isPublicPath) {
    // Сохраняем путь в callbackUrl, чтобы вернуться после входа
    const loginUrl = new URL('/auth/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // ==================== Редирект по ролям ====================
  if (isLoggedIn) {
    // STAFF не должны попадать в /manage (это для BUSINESS_ADMIN)
    if (path.startsWith('/manage') && role === 'STAFF') {
      return NextResponse.redirect(new URL('/staff/dashboard', nextUrl.origin));
    }

    // CLIENT и STAFF не имеют доступа к /admin
    if (path.startsWith('/admin') && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
    }

    // BUSINESS_ADMIN и STAFF не должны видеть страницы клиента (опционально — мягкий редирект)
    if (path.startsWith('/staff') && role === 'BUSINESS_ADMIN') {
      return NextResponse.redirect(new URL('/manage', nextUrl.origin));
    }

    // Авторизованные пользователи не должны видеть страницы входа
    if (path.startsWith('/auth/') && isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

// Конфигурация middleware — указываем для каких путей он запускается
// Исключаем статические файлы Next.js (_next) и favicon
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
