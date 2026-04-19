'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Props {
  bookingId: string;
  currentStatus: string;
}

// ManageBookingActions — кнопки смены статуса для BUSINESS_ADMIN
// Те же переходы что и у STAFF (раздел 8.2 ТЗ)
export default function ManageBookingActions({ bookingId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const changeStatus = async (status: string) => {
    setLoading(true);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      toast.success('Статус обновлён');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === 'PENDING' && (
        <>
          <Button size="sm" onClick={() => changeStatus('CONFIRMED')} disabled={loading}>Подтвердить</Button>
          <Button size="sm" variant="destructive" onClick={() => changeStatus('CANCELLED')} disabled={loading}>Отклонить</Button>
        </>
      )}
      {currentStatus === 'CONFIRMED' && (
        <>
          <Button size="sm" onClick={() => changeStatus('COMPLETED')} disabled={loading}>Завершить</Button>
          <Button size="sm" variant="destructive" onClick={() => changeStatus('CANCELLED')} disabled={loading}>Отменить</Button>
        </>
      )}
    </div>
  );
}
