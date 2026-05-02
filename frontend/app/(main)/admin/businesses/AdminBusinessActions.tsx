'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Props {
  businessId: string;
  isActive: boolean;
  isFeatured: boolean;
}

export default function AdminBusinessActions({ businessId, isActive, isFeatured }: Props) {
  const router = useRouter();
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [active, setActive] = useState(isActive);
  const [featured, setFeatured] = useState(isFeatured);

  const toggleActive = async () => {
    setLoadingActive(true);
    try {
      await api.patch(`/admin/businesses/${businessId}/toggle`);
      setActive((prev) => !prev);
      toast.success(active ? 'Бизнес заблокирован' : 'Бизнес разблокирован');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setLoadingActive(false);
    }
  };

  const toggleFeatured = async () => {
    setLoadingFeatured(true);
    try {
      await api.patch(`/admin/businesses/${businessId}/featured`);
      setFeatured((prev) => !prev);
      toast.success(featured ? 'Убрано из ТОП' : 'Добавлено в ТОП');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setLoadingFeatured(false);
    }
  };

  return (
    // display:contents — дочерние элементы становятся прямыми ячейками родительской сетки
    <div className="contents">
      {/* ТОП-статус */}
      <button
        onClick={toggleFeatured}
        disabled={loadingFeatured}
        title={featured ? 'Убрать из ТОП' : 'Добавить в ТОП'}
        className={`text-lg transition-opacity ${loadingFeatured ? 'opacity-40' : 'hover:scale-110'}`}
      >
        {featured ? '⭐' : '☆'}
      </button>

      {/* Статус */}
      <span>
        {active ? (
          <span className="text-xs text-green-600 font-medium">Активен</span>
        ) : (
          <span className="text-xs text-red-500 font-medium">Заблокирован</span>
        )}
      </span>

      {/* Блокировка */}
      <Button
        size="sm"
        variant={active ? 'destructive' : 'outline'}
        onClick={toggleActive}
        disabled={loadingActive}
      >
        {active ? 'Заблокировать' : 'Разблокировать'}
      </Button>
    </div>
  );
}
