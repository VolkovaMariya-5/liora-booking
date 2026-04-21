'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Навигационные ссылки зависят от роли пользователя (раздел 10 ТЗ)
const NAV_BY_ROLE: Record<string, { label: string; href: string }[]> = {
  // Публичный хедер (не авторизован)
  PUBLIC: [
    { label: 'Каталог', href: '/businesses' },
    { label: 'Для бизнеса', href: '/auth/register-business' },
  ],
  // Клиент
  CLIENT: [
    { label: 'Каталог', href: '/businesses' },
    { label: 'Мои записи', href: '/bookings' },
    { label: 'Избранные', href: '/favorites' },
  ],
  // Мастер
  STAFF: [
    { label: 'Расписание', href: '/staff/dashboard' },
    { label: 'Записи', href: '/staff/bookings' },
    { label: 'Мой график', href: '/staff/schedule' },
  ],
  // Владелец бизнеса
  BUSINESS_ADMIN: [
    { label: 'Дашборд', href: '/manage' },
    { label: 'Мастера', href: '/manage/staff' },
    { label: 'Услуги', href: '/manage/services' },
    { label: 'Записи', href: '/manage/bookings' },
  ],
  // Супер-администратор
  SUPER_ADMIN: [
    { label: 'Статистика', href: '/admin' },
    { label: 'Бизнесы', href: '/admin/businesses' },
    { label: 'Пользователи', href: '/admin/users' },
  ],
};

// Ссылки в выпадающем меню профиля
const PROFILE_LINKS: Record<string, { label: string; href: string }[]> = {
  CLIENT: [{ label: 'Профиль', href: '/profile' }],
  STAFF: [{ label: 'Профиль', href: '/profile' }],
  BUSINESS_ADMIN: [
    { label: 'Профиль', href: '/profile' },
    { label: 'Настройки бизнеса', href: '/manage/settings' },
  ],
  SUPER_ADMIN: [{ label: 'Профиль', href: '/profile' }],
};

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = session?.user?.role || 'PUBLIC';
  const navLinks = NAV_BY_ROLE[role] || NAV_BY_ROLE.PUBLIC;
  const profileLinks = PROFILE_LINKS[role] || [];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Логотип — Cormorant Garamond light для изящного брендового вида */}
          <Link href="/" className="font-heading text-3xl font-light tracking-wide text-primary">
            Liora
          </Link>

          {/* Навигация — десктоп */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-primary bg-primary/8 font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Правая часть: профиль или кнопки входа */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              // Авторизован — выпадающее меню профиля
              // base-ui Menu.Trigger уже рендерит <button>, поэтому передаём className напрямую
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {session.user.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-30 truncate">
                    {session.user.name}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {profileLinks.map((link) => (
                    // render prop — base-ui способ рендерить MenuItem как ссылку (замена asChild)
                    <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    data-variant="destructive"
                    className="text-destructive"
                  >
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Не авторизован — кнопки входа и регистрации
              // render prop — base-ui способ рендерить Button как ссылку (замена asChild)
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" render={<Link href="/auth/login" />}>
                  Войти
                </Button>
                <Button size="sm" render={<Link href="/auth/register" />}>
                  Регистрация
                </Button>
              </div>
            )}

            {/* Гамбургер — мобиль */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium',
                  pathname === link.href
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {link.label}
              </Link>
            ))}
            {!session?.user && (
              <div className="pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  render={<Link href="/auth/login" onClick={() => setMobileOpen(false)} />}
                >
                  Войти
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  render={<Link href="/auth/register" onClick={() => setMobileOpen(false)} />}
                >
                  Регистрация
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
