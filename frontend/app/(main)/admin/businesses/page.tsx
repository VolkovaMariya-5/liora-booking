import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminBusinessActions from './AdminBusinessActions';

interface AdminBusiness {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  isActive: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  owner?: { name: string; email: string };
  _count?: { staff?: number; bookings?: number };
}

// Загружаем все бизнесы для администратора (включая неактивные)
async function fetchAllBusinesses(token: string): Promise<AdminBusiness[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/businesses?limit=100`, {
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

// /admin/businesses — таблица всех бизнесов с блокировкой/разблокировкой (Phase 8)
export default async function AdminBusinessesPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'SUPER_ADMIN') redirect('/dashboard');

  const businesses = await fetchAllBusinesses(session.accessToken as string);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-6">Бизнесы ({businesses.length})</h1>

      <div className="rounded-xl border border-border overflow-hidden">
        {/* Заголовок таблицы */}
        <div className="grid grid-cols-[2fr_1.5fr_120px_48px_90px_140px] gap-3 px-4 py-2 bg-muted text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Название</span>
          <span>Владелец</span>
          <span>Город</span>
          <span>ТОП</span>
          <span>Статус</span>
          <span>Действия</span>
        </div>

        {businesses.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">Нет данных</p>
        ) : (
          businesses.map((b) => (
            <div
              key={b.id}
              className={`grid grid-cols-[2fr_1.5fr_120px_48px_90px_140px] gap-3 items-center px-4 py-3 border-t border-border text-sm ${
                !b.isActive ? 'opacity-50' : ''
              }`}
            >
              <div>
                <p className="font-medium text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground">/{b.slug}</p>
              </div>
              <div>
                <p className="text-foreground">{b.owner?.name ?? '—'}</p>
                <p className="text-xs text-muted-foreground">{b.owner?.email}</p>
              </div>
              <span className="text-muted-foreground">{b.city}</span>
              {/* ТОП-статус + кнопка тоггла */}
              <AdminBusinessActions businessId={b.id} isActive={b.isActive} isFeatured={b.isFeatured} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
