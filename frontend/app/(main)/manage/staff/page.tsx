import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EmptyState } from '@/components/shared/EmptyState';
import { Users } from 'lucide-react';
import StaffList from './StaffList';

interface Service {
  id: string;
  name: string;
}

interface StaffMember {
  id: string;
  bio?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  user?: { name: string; email: string; avatarUrl?: string | null };
  services?: { service: Service }[];
}

// Загружаем всех мастеров бизнеса (включая неактивных)
async function fetchStaff(token: string): Promise<StaffMember[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/staff`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Загружаем услуги для привязки к мастерам
async function fetchServices(token: string): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/services`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// /manage/staff — список мастеров бизнеса для владельца (Phase 7)
export default async function ManageStaffPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'BUSINESS_ADMIN') redirect('/dashboard');

  // Загружаем мастеров и услуги параллельно
  const [staff, services] = await Promise.all([
    fetchStaff(session.accessToken as string),
    fetchServices(session.accessToken as string),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-4xl font-semibold">Мастера</h1>
      </div>

      {staff.length === 0 && services.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Начните с добавления услуг"
          description="Сначала добавьте услуги в разделе «Услуги», затем создайте мастеров и привяжите услуги"
        />
      ) : (
        <StaffList staff={staff} availableServices={services} />
      )}
    </div>
  );
}
