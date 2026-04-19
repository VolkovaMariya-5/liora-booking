import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EmptyState } from '@/components/shared/EmptyState';
import { Scissors } from 'lucide-react';
import ServicesList from './ServicesList';

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  durationMin: number;
  isActive: boolean;
}

// Загружаем все услуги бизнеса (включая неактивные)
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

// /manage/services — список услуг бизнеса (Phase 7)
export default async function ManageServicesPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'BUSINESS_ADMIN') redirect('/dashboard');

  const services = await fetchServices(session.accessToken as string);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-4xl font-semibold">Услуги</h1>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="Услуг пока нет"
          description="Добавьте услуги, чтобы клиенты могли записываться"
        />
      ) : (
        <ServicesList services={services} />
      )}
    </div>
  );
}
