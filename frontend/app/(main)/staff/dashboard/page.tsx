import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface StaffBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  clientName?: string;
  items?: { service: { name: string } }[];
}

// Загружаем записи мастера на сегодня
async function fetchTodayBookings(token: string): Promise<StaffBooking[]> {
  const today = new Date().toISOString().split('T')[0];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings?date=${today}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

// /staff/dashboard — главная мастера: расписание на сегодня (Phase 7)
export default async function StaffDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'STAFF') redirect('/dashboard');

  const todayBookings = await fetchTodayBookings(session.accessToken as string);
  const today = new Date().toLocaleDateString('ru', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-1">Мой день</h1>
      <p className="text-muted-foreground mb-6 capitalize">{today}</p>

      {todayBookings.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">На сегодня записей нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todayBookings
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((b) => (
              <Link
                key={b.id}
                href={`/staff/bookings/${b.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all"
              >
                {/* Время */}
                <div className="text-center shrink-0 w-14">
                  <p className="font-semibold text-foreground text-lg leading-tight">{b.startTime}</p>
                  <p className="text-xs text-muted-foreground">{b.endTime}</p>
                </div>

                {/* Разделитель */}
                <div className="w-px h-10 bg-border shrink-0" />

                {/* Детали */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {b.clientName ?? 'Клиент'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {b.items?.map((i) => i.service.name).join(', ')}
                  </p>
                </div>

                <StatusBadge status={b.status as any} />
              </Link>
            ))}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link
          href="/staff/bookings"
          className="text-sm text-primary hover:underline"
        >
          Все записи →
        </Link>
        <Link
          href="/staff/schedule"
          className="text-sm text-primary hover:underline ml-4"
        >
          Моё расписание →
        </Link>
      </div>
    </div>
  );
}
