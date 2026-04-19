import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CANCELLATION_HOURS_LIMIT } from '@/lib/constants';
import BookingActions from './BookingActions';

interface BookingDetail {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  clientName?: string;
  clientPhone?: string;
  totalPrice?: number;
  createdAt: string;
  staff?: { name: string; id: string };
  business?: { name: string; slug: string };
  items?: { service: { name: string; price: number; durationMin: number } }[];
  review?: { id: string; rating: number; comment?: string };
}

// Загружаем детали одной записи по id
async function fetchBooking(id: string, token: string): Promise<BookingDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// /bookings/[id] — детальная страница записи
// Показывает детали, кнопку отмены (с проверкой 2 часов), форму отзыва
export default async function BookingDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const { id } = await params;
  const booking = await fetchBooking(id, session.accessToken as string);
  if (!booking) notFound();

  // Проверяем, можно ли ещё отменить (за >= 2 часа до начала)
  const bookingDateTime = new Date(`${booking.date.split('T')[0]}T${booking.startTime}`);
  const hoursUntil = (bookingDateTime.getTime() - Date.now()) / 1000 / 3600;
  const canCancel =
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
    hoursUntil >= CANCELLATION_HOURS_LIMIT;

  const canReview = booking.status === 'COMPLETED' && !booking.review;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Навигация назад */}
      <Link
        href="/bookings"
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6"
      >
        ← Все записи
      </Link>

      <div className="flex items-start justify-between gap-3 mb-6">
        <h1 className="font-heading text-3xl font-semibold">
          {booking.business?.name ?? 'Запись'}
        </h1>
        <StatusBadge status={booking.status as any} />
      </div>

      {/* Детали записи */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-sm mb-6">
        <DetailRow label="Мастер" value={booking.staff?.name} />
        <DetailRow
          label="Услуги"
          value={booking.items?.map((i) => i.service.name).join(', ')}
        />
        <DetailRow
          label="Дата и время"
          value={`${new Date(booking.date).toLocaleDateString('ru', {
            weekday: 'long', day: 'numeric', month: 'long',
          })} в ${booking.startTime}`}
        />
        <DetailRow label="Длительность" value={
          booking.items
            ? `${booking.items.reduce((a, i) => a + i.service.durationMin, 0)} мин`
            : undefined
        } />
        {booking.clientPhone && <DetailRow label="Телефон" value={booking.clientPhone} />}
        <DetailRow
          label="Создана"
          value={new Date(booking.createdAt).toLocaleDateString('ru', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        />
        {booking.totalPrice !== undefined && (
          <div className="pt-2 border-t border-border flex justify-between font-semibold">
            <span>Итого</span>
            <span className="text-primary">{Number(booking.totalPrice).toLocaleString('ru')} ₽</span>
          </div>
        )}
      </div>

      {/* Существующий отзыв */}
      {booking.review && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6">
          <p className="font-medium text-foreground mb-1">Ваш отзыв</p>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < booking.review!.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}>★</span>
            ))}
          </div>
          {booking.review.comment && (
            <p className="text-sm text-muted-foreground">{booking.review.comment}</p>
          )}
        </div>
      )}

      {/* Кнопки действий (client component) */}
      <BookingActions
        bookingId={booking.id}
        businessSlug={booking.business?.slug}
        staffId={booking.staff?.id}
        canCancel={canCancel}
        canReview={canReview}
        hoursUntil={hoursUntil}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}
