import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// proxy.ts — Edge Runtime middleware для защиты маршрутов
// НЕ импортирует auth.ts (Node.js зависимости несовместимы с Edge Runtime)
// Только проверяет наличие сессионной куки — полная верификация в Server Components

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const publicPaths = [
    '/',
    '/businesses',
    '/auth/login',
    '/auth/register',
    '/auth/register-business',
  ];
  const isPublicPath = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );

  const sessionCookie =
    request.cookies.get('authjs.session-token') ||
    request.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!sessionCookie;

  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
