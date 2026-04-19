import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { CalendarDays } from 'lucide-react';
import StaffBookingActions from './StaffBookingActions';

interface StaffBooking {
  id: string;
  date: string;
  startTime: string;
  status: string;
  clientName?: string;
  totalPrice?: number;
  items?: { service: { name: string } }[];
}

async function fetchStaffBookings(token: string, status?: string): Promise<StaffBooking[]> {
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

// /staff/bookings — список записей мастера с кнопками смены статуса (Phase 7)
export default async function StaffBookingsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'STAFF') redirect('/dashboard');

  const { status = '' } = await searchParams;
  const bookings = await fetchStaffBookings(session.accessToken as string, status || undefined);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-6">Записи</h1>

      {/* Фильтр по статусу */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => {
          const href = tab.value ? `/staff/bookings?status=${tab.value}` : '/staff/bookings';
          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                status === tab.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary hover:text-primary'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Записей нет" />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-foreground">{b.clientName ?? 'Клиент'}</p>
                  <p className="text-sm text-muted-foreground">
                    {b.items?.map((i) => i.service.name).join(', ')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {new Date(b.date).toLocaleDateString('ru', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}{' '}
                    в {b.startTime}
                  </p>
                </div>
                <StatusBadge status={b.status as any} />
              </div>

              {/* Кнопки смены статуса — client component */}
              <StaffBookingActions bookingId={b.id} currentStatus={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
