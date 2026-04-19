'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Props {
  businessId: string;
  isActive: boolean;
}

// AdminBusinessActions — кнопка блокировки/разблокировки бизнеса для SUPER_ADMIN
// После блокировки бизнес исчезает из публичного каталога (раздел 15 ТЗ)
export default function AdminBusinessActions({ businessId, isActive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  const toggle = async () => {
    setLoading(true);
    try {
      await api.patch(`/admin/businesses/${businessId}/toggle`);
      setActive((prev) => !prev);
      toast.success(active ? 'Бизнес заблокирован' : 'Бизнес разблокирован');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={active ? 'destructive' : 'outline'}
      onClick={toggle}
      disabled={loading}
    >
      {active ? 'Заблокировать' : 'Разблокировать'}
    </Button>
  );
}
