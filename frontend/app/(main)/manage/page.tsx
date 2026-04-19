import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Users, Scissors, CalendarDays, Settings } from 'lucide-react';

interface DashboardStats {
  staffCount: number;
  serviceCount: number;
  todayBookings: number;
  pendingBookings: number;
}

interface RecentBooking {
  id: string;
  date: string;
  startTime: string;
  status: string;
  clientName?: string;
  staff?: { name: string };
  items?: { service: { name: string } }[];
}

// Загружаем статистику бизнеса
async function fetchDashboard(token: string): Promise<{ stats: DashboardStats; recent: RecentBooking[] }> {
  const today = new Date().toISOString().split('T')[0];
  try {
    const [bookingsRes, staffRes, servicesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/staff`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/services`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
    ]);

    const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { data: [], total: 0 };
    const staffData = staffRes.ok ? await staffRes.json() : [];
    const servicesData = servicesRes.ok ? await servicesRes.json() : [];

    const allBookings: RecentBooking[] = Array.isArray(bookingsData) ? bookingsData : bookingsData.data ?? [];
    const todayCount = allBookings.filter((b) => b.date?.startsWith(today)).length;
    const pendingCount = allBookings.filter((b) => b.status === 'PENDING').length;

    return {
      stats: {
        staffCount: Array.isArray(staffData) ? staffData.length : 0,
        serviceCount: Array.isArray(servicesData) ? servicesData.length : 0,
        todayBookings: todayCount,
        pendingBookings: pendingCount,
      },
      recent: allBookings.slice(0, 5),
    };
  } catch {
    return { stats: { staffCount: 0, serviceCount: 0, todayBookings: 0, pendingBookings: 0 }, recent: [] };
  }
}

// /manage — дашборд владельца бизнеса (Phase 7)
export default async function ManageDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'BUSINESS_ADMIN') redirect('/dashboard');

  const { stats, recent } = await fetchDashboard(session.accessToken as string);

  const counters = [
    { label: 'Мастеров', value: stats.staffCount, href: '/manage/staff', icon: Users },
    { label: 'Услуг', value: stats.serviceCount, href: '/manage/services', icon: Scissors },
    { label: 'Записей сегодня', value: stats.todayBookings, href: '/manage/bookings', icon: CalendarDays },
    { label: 'Ожидают', value: stats.pendingBookings, href: '/manage/bookings?status=PENDING', icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-2">Кабинет</h1>
      <p className="text-muted-foreground mb-8">Управление вашим бизнесом</p>

      {/* Счётчики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {counters.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors"
          >
            <c.icon className="w-5 h-5 text-muted-foreground mb-2" />
            <p className="text-3xl font-bold text-primary">{c.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Последние записи */}
      <h2 className="font-semibold text-lg mb-3">Последние записи</h2>
      {recent.length === 0 ? (
        <p className="text-muted-foreground text-sm">Нет записей</p>
      ) : (
        <div className="space-y-2">
          {recent.map((b) => (
            <Link
              key={b.id}
              href={`/manage/bookings`}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 transition-all"
            >
              <div>
                <p className="font-medium text-foreground text-sm">
                  {b.clientName ?? 'Клиент'} → {b.staff?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {b.items?.map((i) => i.service.name).join(', ')} ·{' '}
                  {new Date(b.date).toLocaleDateString('ru', { day: 'numeric', month: 'short' })} в {b.startTime}
                </p>
              </div>
              <StatusBadge status={b.status as any} />
            </Link>
          ))}
        </div>
      )}

      {/* Быстрые ссылки */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/manage/staff" className="text-sm text-primary hover:underline">Управление мастерами →</Link>
        <Link href="/manage/services" className="text-sm text-primary hover:underline">Управление услугами →</Link>
        <Link href="/manage/settings" className="text-sm text-primary hover:underline">Настройки бизнеса →</Link>
      </div>
    </div>
  );
}
