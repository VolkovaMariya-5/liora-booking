'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { CANCELLATION_HOURS_LIMIT } from '@/lib/constants';
import ReviewForm from './ReviewForm';

interface BookingActionsProps {
  bookingId: string;
  businessSlug?: string;
  staffId?: string;
  canCancel: boolean;
  canReview: boolean;
  hoursUntil: number;
}

// BookingActions — клиентский компонент с кнопками отмены и написания отзыва
// Отмена недоступна менее чем за CANCELLATION_HOURS_LIMIT часов до записи
export default function BookingActions({
  bookingId,
  businessSlug,
  staffId,
  canCancel,
  canReview,
  hoursUntil,
}: BookingActionsProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Вы уверены, что хотите отменить запись?')) return;
    setCancelling(true);
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success('Запись отменена');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Не удалось отменить запись');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Кнопка отмены */}
      {(canCancel || hoursUntil > 0) && (
        <div>
          <Button
            variant="destructive"
            disabled={!canCancel || cancelling}
            onClick={handleCancel}
          >
            {cancelling ? 'Отменяем...' : 'Отменить запись'}
          </Button>
          {!canCancel && hoursUntil > 0 && hoursUntil < CANCELLATION_HOURS_LIMIT && (
            <p className="text-xs text-muted-foreground mt-1">
              Отмена недоступна — осталось менее {CANCELLATION_HOURS_LIMIT} часов
            </p>
          )}
        </div>
      )}

      {/* Кнопка написания отзыва */}
      {canReview && !showReview && (
        <Button variant="outline" onClick={() => setShowReview(true)}>
          Оставить отзыв
        </Button>
      )}

      {/* Форма отзыва */}
      {showReview && (
        <ReviewForm
          bookingId={bookingId}
          onSuccess={() => {
            setShowReview(false);
            router.refresh();
          }}
          onCancel={() => setShowReview(false)}
        />
      )}
    </div>
  );
}
