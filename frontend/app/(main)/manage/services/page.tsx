import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ServicesList from './ServicesList';

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  isActive: boolean;
}

async function fetchBusinessCountry(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/settings`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
    });
    if (!res.ok) return null;
    const b = await res.json();
    return b.country ?? null;
  } catch { return null; }
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

  const [services, businessCountry] = await Promise.all([
    fetchServices(session.accessToken as string),
    fetchBusinessCountry(session.accessToken as string),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-4xl font-semibold">Услуги</h1>
      </div>

      <ServicesList services={services} businessCountry={businessCountry} />
    </div>
  );
}
