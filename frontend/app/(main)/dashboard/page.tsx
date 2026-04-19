import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BusinessCard } from '@/components/businesses/BusinessCard';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

// Загружаем ближайшую активную запись клиента
async function fetchUpcomingBooking(token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings?status=CONFIRMED&limit=1`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data ?? [];
    return list[0] ?? null;
  } catch {
    return null;
  }
}

// Загружаем популярные бизнесы из города пользователя
async function fetchLocalBusinesses(city?: string) {
  try {
    const params = new URLSearchParams({ limit: '3', ...(city && { city }) });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/businesses?${params}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

// /dashboard — домашняя страница авторизованного клиента (Phase 6)
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const [upcomingBooking, localBusinesses] = await Promise.all([
    fetchUpcomingBooking(session.accessToken as string),
    fetchLocalBusinesses((session.user as any).city),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Приветствие */}
      <h1 className="font-heading text-4xl font-semibold mb-2">
        Привет, {session.user.name?.split(' ')[0]} 👋
      </h1>
      <p className="text-muted-foreground mb-8">
        Управляйте записями и находите новых мастеров
      </p>

      {/* Ближайшая запись */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Ближайшая запись</h2>
        {upcomingBooking ? (
          <Link
            href={`/bookings/${upcomingBooking.id}`}
            className="block rounded-xl border border-primary/30 bg-primary/5 p-4 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {upcomingBooking.business?.name ?? 'Бизнес'}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {upcomingBooking.staff?.name} ·{' '}
                  {upcomingBooking.items?.map((i: any) => i.service.name).join(', ')}
                </p>
                <p className="text-sm font-medium text-primary mt-1 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(upcomingBooking.date).toLocaleDateString('ru', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}{' '}
                  в {upcomingBooking.startTime}
                </p>
              </div>
              <StatusBadge status={upcomingBooking.status} />
            </div>
          </Link>
        ) : (
          <div className="rounded-xl border border-border p-4 text-center text-muted-foreground">
            <p className="mb-3">Нет предстоящих записей</p>
            <Button size="sm" render={<Link href="/businesses" />}>
              Найти мастера
            </Button>
          </div>
        )}
      </section>

      {/* Популярное рядом */}
      {localBusinesses.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-semibold text-lg">Популярное рядом</h2>
            <Link href="/businesses" className="text-sm text-primary hover:underline">
              Все →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {localBusinesses.map((b: any) => (
              <BusinessCard
                key={b.id}
                id={b.id}
                name={b.name}
                slug={b.slug}
                category={b.category}
                city={b.city}
                logoUrl={b.logoUrl}
                avgRating={b.avgRating}
                reviewCount={b.reviewCount}
                staffCount={b.staffCount}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
