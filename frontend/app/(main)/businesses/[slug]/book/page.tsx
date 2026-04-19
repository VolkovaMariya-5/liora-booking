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
// Требует авторизации; неавторизованных перенаправляет на /auth/login
export default async function BookPage({ params }: PageProps) {
  // Проверяем авторизацию — запись требует аккаунта
  const session = await auth();
  const { slug } = await params;

  if (!session?.user) {
    redirect(`/auth/login?redirect=/businesses/${slug}/book`);
  }

  const business = await fetchBookingData(slug);
  if (!business) notFound();

  return (
    <BookingWizard
      businessSlug={slug}
      businessName={business.name}
      staffList={business.staff ?? []}
      maxAdvanceDays={business.maxAdvanceBookingDays ?? 30}
    />
  );
}
