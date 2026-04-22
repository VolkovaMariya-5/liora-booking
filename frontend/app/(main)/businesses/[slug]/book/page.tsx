import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import BookingWizard from './BookingWizard';

// Загружаем данные бизнеса и список мастеров (Server Component)
async function fetchBookingData(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/businesses/${slug}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

// /businesses/[slug]/book — страница онлайн-записи
// Поддерживает два флоу: ?flow=service (услуга→мастер) и по умолчанию (мастер→услуга)
export default async function BookPage({ params, searchParams }: PageProps) {
  const session = await auth();
  const { slug } = await params;
  const sp = await searchParams;

  if (!session?.user) {
    redirect(`/auth/login?redirect=/businesses/${slug}/book`);
  }

  const business = await fetchBookingData(slug);
  if (!business) notFound();

  // Собираем дедуплицированный список всех услуг бизнеса для флоу "по услуге"
  const allServices = business.services ?? [];
  const flow = sp.flow === 'service' ? 'service' : 'master';

  return (
    <BookingWizard
      businessSlug={slug}
      businessId={business.id}
      businessName={business.name}
      staffList={business.staff ?? []}
      allServices={allServices}
      maxAdvanceDays={business.maxAdvanceBookingDays ?? 30}
      flow={flow}
    />
  );
}
