'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface StaffBookingActionsProps {
  bookingId: string;
  currentStatus: string;
}

// StaffBookingActions — кнопки смены статуса записи для мастера
// Машина состояний (раздел 8.2 ТЗ): PENDING→CONFIRMED, CONFIRMED→COMPLETED, оба→CANCELLED
export default function StaffBookingActions({
  bookingId,
  currentStatus,
}: StaffBookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const changeStatus = async (status: string) => {
    setLoading(true);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Статус изменён на «${STATUS_LABELS[status]}»`);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Не удалось изменить статус');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === 'PENDING' && (
        <>
          <Button size="sm" onClick={() => changeStatus('CONFIRMED')} disabled={loading}>
            Подтвердить
          </Button>
          <Button size="sm" variant="destructive" onClick={() => changeStatus('CANCELLED')} disabled={loading}>
            Отклонить
          </Button>
        </>
      )}
      {currentStatus === 'CONFIRMED' && (
        <>
          <Button size="sm" onClick={() => changeStatus('COMPLETED')} disabled={loading}>
            Завершить
          </Button>
          <Button size="sm" variant="destructive" onClick={() => changeStatus('CANCELLED')} disabled={loading}>
            Отменить
          </Button>
        </>
      )}
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Подтверждено',
  COMPLETED: 'Завершено',
  CANCELLED: 'Отменено',
};
