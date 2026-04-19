import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2, Users, CalendarDays } from 'lucide-react';

interface AdminStats {
  businessCount: number;
  userCount: number;
  bookingCount: number;
}

// Загружаем статистику для супер-администратора
async function fetchStats(token: string): Promise<AdminStats> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return { businessCount: 0, userCount: 0, bookingCount: 0 };
    return res.json();
  } catch {
    return { businessCount: 0, userCount: 0, bookingCount: 0 };
  }
}

// /admin — главная страница супер-администратора (Phase 8)
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'SUPER_ADMIN') redirect('/dashboard');

  const stats = await fetchStats(session.accessToken as string);

  const cards = [
    { label: 'Бизнесов', value: stats.businessCount, href: '/admin/businesses', icon: Building2 },
    { label: 'Пользователей', value: stats.userCount, href: '/admin/users', icon: Users },
    { label: 'Всего записей', value: stats.bookingCount, href: '/admin/businesses', icon: CalendarDays },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-2">Администрирование</h1>
      <p className="text-muted-foreground mb-8">Управление платформой Liora</p>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary transition-colors"
          >
            <card.icon className="w-6 h-6 text-muted-foreground mb-3" />
            <p className="text-4xl font-bold text-primary">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Быстрые ссылки */}
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/businesses" className="text-sm text-primary hover:underline">
          Управление бизнесами →
        </Link>
        <Link href="/admin/users" className="text-sm text-primary hover:underline">
          Управление пользователями →
        </Link>
      </div>
    </div>
  );
}
