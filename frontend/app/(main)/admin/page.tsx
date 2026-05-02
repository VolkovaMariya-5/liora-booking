import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2, Users, CalendarDays, Star } from 'lucide-react';

// Поля соответствуют тому что возвращает GET /admin/stats
interface AdminStats {
  businesses: number;
  users: number;
  bookings: number;
  reviews: number;
  bookingsByStatus?: Record<string, number>;
}

async function fetchStats(token: string): Promise<AdminStats> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return { businesses: 0, users: 0, bookings: 0, reviews: 0 };
    return res.json();
  } catch {
    return { businesses: 0, users: 0, bookings: 0, reviews: 0 };
  }
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'SUPER_ADMIN') redirect('/dashboard');

  const stats = await fetchStats(session.accessToken as string);

  const cards = [
    { label: 'Бизнесов',       value: stats.businesses, href: '/admin/businesses', icon: Building2   },
    { label: 'Пользователей',  value: stats.users,      href: '/admin/users',      icon: Users       },
    { label: 'Всего записей',  value: stats.bookings,   href: null,                icon: CalendarDays },
    { label: 'Отзывов',        value: stats.reviews,    href: null,                icon: Star         },
  ];

  const statusLabels: Record<string, string> = {
    PENDING: 'Ожидают', CONFIRMED: 'Подтверждено',
    COMPLETED: 'Завершено', CANCELLED: 'Отменено',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-2">Статистика</h1>
      <p className="text-muted-foreground mb-8">Обзор платформы Liora</p>

      {/* Основные карточки */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const inner = (
            <>
              <card.icon className="w-5 h-5 text-muted-foreground mb-3" />
              <p className="text-4xl font-bold text-primary">{card.value ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </>
          );
          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors"
            >
              {inner}
            </Link>
          ) : (
            <div key={card.label} className="rounded-xl border border-border bg-card p-5">
              {inner}
            </div>
          );
        })}
      </div>

      {/* Записи по статусам */}
      {stats.bookingsByStatus && Object.keys(stats.bookingsByStatus).length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <h2 className="font-heading text-xl font-normal mb-4">Записи по статусам</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(stats.bookingsByStatus).map(([status, count]) => (
              <div key={status}>
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {statusLabels[status] ?? status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

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
