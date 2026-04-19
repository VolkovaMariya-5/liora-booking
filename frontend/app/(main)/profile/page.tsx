import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
  role: string;
  _count?: { bookings?: number; favorites?: number };
}

// Загружаем профиль пользователя
async function fetchProfile(token: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// /profile — страница профиля с аватаром и статистикой (Phase 6)
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const profile = await fetchProfile(session.accessToken as string);
  if (!profile) redirect('/auth/login');

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-6">Профиль</h1>

      {/* Аватар и основные данные */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-6 mb-6">
        {/* Аватар */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center border-2 border-border">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt={profile.name} fill className="object-cover" />
          ) : (
            <span className="text-2xl font-semibold text-primary">{initials}</span>
          )}
        </div>

        {/* Данные */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{profile.email}</p>
          {profile.city && (
            <p className="text-muted-foreground text-sm mt-0.5">
              {profile.city}{profile.country ? `, ${profile.country}` : ''}
            </p>
          )}
          {profile.phone && (
            <p className="text-muted-foreground text-sm mt-0.5">{profile.phone}</p>
          )}
        </div>
      </div>

      {/* Статистика */}
      {profile._count && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/bookings" className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary transition-colors">
            <p className="text-3xl font-bold text-primary">{profile._count.bookings ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Всего записей</p>
          </Link>
          <Link href="/favorites" className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary transition-colors">
            <p className="text-3xl font-bold text-primary">{profile._count.favorites ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Избранных</p>
          </Link>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button render={<Link href="/profile/edit" />}>
          Редактировать профиль
        </Button>
        <Button variant="outline" render={<Link href="/profile/password" />}>
          Сменить пароль
        </Button>
      </div>
    </div>
  );
}
