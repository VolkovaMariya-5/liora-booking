import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EmptyState } from '@/components/shared/EmptyState';
import { Users } from 'lucide-react';
import StaffList from './StaffList';

interface StaffMember {
  id: string;
  name: string;
  bio?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  user?: { email: string };
  staffServices?: { service: { name: string } }[];
}

// Загружаем всех мастеров бизнеса
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

// /manage/staff — список мастеров бизнеса для владельца (Phase 7)
export default async function ManageStaffPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'BUSINESS_ADMIN') redirect('/dashboard');

  const staff = await fetchStaff(session.accessToken as string);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-4xl font-semibold">Мастера</h1>
      </div>

      {staff.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Мастеров пока нет"
          description="Добавьте первого мастера, чтобы клиенты могли записываться"
        />
      ) : (
        <StaffList staff={staff} />
      )}
    </div>
  );
}
