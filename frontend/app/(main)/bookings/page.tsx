import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { CalendarDays } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice?: number;
  staff?: { name: string };
  business?: { name: string; slug: string };
  items?: { service: { name: string } }[];
}

// Загружаем список записей текущего пользователя
async function fetchBookings(token: string, status?: string): Promise<Booking[]> {
  const params = status ? `?status=${status}` : '';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

// Статусы для фильтра вкладок
const STATUS_TABS = [
  { value: '', label: 'Все' },
  { value: 'PENDING', label: 'Ожидают' },
  { value: 'CONFIRMED', label: 'Подтверждённые' },
  { value: 'COMPLETED', label: 'Завершённые' },
  { value: 'CANCELLED', label: 'Отменённые' },
];

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

// /bookings — список записей клиента (Phase 6)
// Фильтр по статусу через URL params; каждая строка — ссылка на детальную страницу
export default async function BookingsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?redirect=/bookings');

  const { status = '' } = await searchParams;
  const bookings = await fetchBookings(session.accessToken as string, status || undefined);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-6">Мои записи</h1>

      {/* Фильтры по статусу */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => {
          const href = tab.value ? `?status=${tab.value}` : '/bookings';
          const isActive = status === tab.value;
          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary hover:text-primary'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Список записей или пустое состояние */}
      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Записей пока нет"
          description="Запишитесь к мастеру в каталоге и управляйте записями здесь"
          action={{ label: 'Перейти в каталог', href: '/businesses' }}
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={`/bookings/${b.id}`}
              className="block rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  {/* Название бизнеса и мастер */}
                  <p className="font-semibold text-foreground truncate">
                    {b.business?.name ?? 'Бизнес'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {b.staff?.name ?? 'Мастер'} ·{' '}
                    {b.items?.map((i) => i.service.name).join(', ')}
                  </p>
                  {/* Дата и время */}
                  <p className="text-sm text-muted-foreground">
                    {new Date(b.date).toLocaleDateString('ru', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}{' '}
                    в {b.startTime}
                  </p>
                </div>
                <StatusBadge status={b.status as any} />
              </div>
              {b.totalPrice !== undefined && (
                <p className="text-sm font-semibold text-primary mt-2">
                  {Number(b.totalPrice).toLocaleString('ru')} ₽
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
