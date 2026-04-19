import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { StaffCard } from '@/components/staff/StaffCard';

interface FavoriteItem {
  id: string;
  staff: {
    id: string;
    name: string;
    bio?: string | null;
    photoUrl?: string | null;
    user?: { avatarUrl?: string | null };
    business?: { slug: string };
    staffServices?: { service: { name: string; price: number } }[];
  };
}

// Загружаем список избранных мастеров
async function fetchFavorites(token: string): Promise<FavoriteItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// /favorites — список избранных мастеров клиента (Phase 6)
export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?redirect=/favorites');

  const favorites = await fetchFavorites(session.accessToken as string);

  if (favorites.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading text-4xl font-semibold mb-6">Избранные</h1>
        <EmptyState
          icon={Heart}
          title="Нет избранных мастеров"
          description="Нажмите ❤ на карточке мастера, чтобы добавить его в избранное"
          action={{ label: 'Перейти в каталог', href: '/businesses' }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-6">
        Избранные ({favorites.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav) => (
          <StaffCard
            key={fav.id}
            id={fav.staff.id}
            businessSlug={fav.staff.business?.slug ?? ''}
            name={fav.staff.name}
            bio={fav.staff.bio}
            photoUrl={fav.staff.photoUrl}
            avatarUrl={fav.staff.user?.avatarUrl}
            services={fav.staff.staffServices}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
}
