'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api';

interface Service {
  service: { name: string; price: number | string };
}

interface StaffCardProps {
  id: string;
  businessSlug: string;
  name: string;
  bio?: string | null;
  photoUrl?: string | null;
  avatarUrl?: string | null; // из user.avatarUrl
  services?: Service[];
  isFavorite?: boolean;
  onFavoriteChange?: (staffId: string, isFav: boolean) => void;
}

// StaffCard — карточка мастера на странице бизнеса и в избранных
// Содержит: фото, имя, bio, услуги, кнопку ❤ и кнопку "Записаться"
export function StaffCard({
  id, businessSlug, name, bio, photoUrl, avatarUrl, services = [],
  isFavorite: initialFavorite = false, onFavoriteChange,
}: StaffCardProps) {
  const { data: session } = useSession();
  const [isFav, setIsFav] = useState(initialFavorite);
  const [favLoading, setFavLoading] = useState(false);

  const photo = photoUrl || avatarUrl;

  // Переключение избранного — оптимистичное обновление
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // не переходим по ссылке карточки

    if (!session?.user) {
      toast.error('Войдите, чтобы добавлять мастеров в избранное');
      return;
    }

    setFavLoading(true);
    const newState = !isFav;
    setIsFav(newState); // сразу меняем UI (оптимистично)

    try {
      if (newState) {
        await api.post(`/favorites/${id}`);
        toast.success('Добавлено в избранное');
      } else {
        await api.delete(`/favorites/${id}`);
        toast.success('Убрано из избранного');
      }
      onFavoriteChange?.(id, newState);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // Уже в избранном — просто синхронизируем состояние
        setIsFav(true);
      } else {
        setIsFav(!newState);
        toast.error('Не удалось обновить избранное');
      }
    } finally {
      setFavLoading(false);
    }
  };

  // Показываем до 3 услуг, остальные скрываем
  const displayedServices = services.slice(0, 3);
  const hiddenCount = services.length - displayedServices.length;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-border">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Фото мастера */}
          <Avatar className="w-16 h-16 shrink-0 ring-2 ring-border">
            <AvatarImage src={photo || undefined} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {name?.charAt(0) ?? '?'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Имя + кнопка избранного */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground leading-tight">{name}</h3>

              {/* Кнопка ❤ — показывается только авторизованным клиентам */}
              <button
                type="button"
                onClick={toggleFavorite}
                disabled={favLoading}
                aria-label={isFav ? 'Убрать из избранного' : 'В избранное'}
                className="shrink-0 p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`}
                />
              </button>
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{bio}</p>
            )}
          </div>
        </div>

        {/* Список услуг */}
        {displayedServices.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {displayedServices.map((ss, i) => (
              <span
                key={i}
                className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
              >
                {ss.service.name}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="text-xs text-primary px-2 py-0.5">+{hiddenCount} ещё</span>
            )}
          </div>
        )}

        {/* Кнопка записи */}
        <div className="mt-4">
          <Button
            size="sm"
            className="w-full"
            render={<Link href={`/businesses/${businessSlug}/book?staffId=${id}`} />}
          >
            Записаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
