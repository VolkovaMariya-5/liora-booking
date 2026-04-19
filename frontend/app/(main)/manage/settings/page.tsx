import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BusinessSettingsForm from './BusinessSettingsForm';

interface BusinessSettings {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  maxAdvanceBookingDays: number;
}

// Загружаем настройки бизнеса
async function fetchSettings(token: string): Promise<BusinessSettings | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/settings`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// /manage/settings — настройки бизнеса (Phase 7)
export default async function BusinessSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'BUSINESS_ADMIN') redirect('/dashboard');

  const settings = await fetchSettings(session.accessToken as string);
  if (!settings) redirect('/manage');

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-semibold mb-6">Настройки бизнеса</h1>
      <BusinessSettingsForm initialData={settings} />
    </div>
  );
}
