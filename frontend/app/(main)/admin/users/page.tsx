import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  city?: string | null;
  country?: string | null;
  createdAt: string;
  isDeleted: boolean;
}

// Загружаем всех пользователей платформы
async function fetchUsers(token: string, role?: string): Promise<AdminUser[]> {
  const params = role ? `?role=${role}&limit=100` : '?limit=100';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users${params}`, {
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

const ROLE_LABELS: Record<string, string> = {
  CLIENT: 'Клиент',
  STAFF: 'Мастер',
  BUSINESS_ADMIN: 'Владелец',
  SUPER_ADMIN: 'Админ',
};

const ROLE_COLORS: Record<string, string> = {
  CLIENT: 'bg-blue-50 text-blue-700',
  STAFF: 'bg-purple-50 text-purple-700',
  BUSINESS_ADMIN: 'bg-amber-50 text-amber-700',
  SUPER_ADMIN: 'bg-red-50 text-red-700',
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

// /admin/users — таблица пользователей с фильтром по роли (Phase 8)
export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'SUPER_ADMIN') redirect('/dashboard');

  const { role = '' } = await searchParams;
  const users = await fetchUsers(session.accessToken as string, role || undefined);

  const roleTabs = [
    { value: '', label: 'Все' },
    { value: 'CLIENT', label: 'Клиенты' },
    { value: 'STAFF', label: 'Мастера' },
    { value: 'BUSINESS_ADMIN', label: 'Владельцы' },
    { value: 'SUPER_ADMIN', label: 'Админы' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-semibold mb-6">Пользователи ({users.length})</h1>

      {/* Фильтр по роли */}
      <div className="flex flex-wrap gap-2 mb-6">
        {roleTabs.map((tab) => {
          const href = tab.value ? `/admin/users?role=${tab.value}` : '/admin/users';
          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                role === tab.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary hover:text-primary'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Таблица пользователей */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-4 py-2 bg-muted text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Пользователь</span>
          <span>Email</span>
          <span>Роль</span>
          <span>Дата</span>
        </div>

        {users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">Нет пользователей</p>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className={`grid grid-cols-[1fr_1fr_auto_auto] gap-3 items-center px-4 py-3 border-t border-border text-sm ${
                u.isDeleted ? 'opacity-40 line-through' : ''
              }`}
            >
              <div>
                <p className="font-medium text-foreground">{u.name}</p>
                {u.city && (
                  <p className="text-xs text-muted-foreground">{u.city}</p>
                )}
              </div>
              <span className="text-muted-foreground truncate">{u.email}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role] ?? 'bg-muted text-muted-foreground'}`}>
                {ROLE_LABELS[u.role] ?? u.role}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(u.createdAt).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
