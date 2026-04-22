import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffCard } from '@/components/staff/StaffCard';
import { BUSINESS_CATEGORIES } from '@/lib/constants';

// ─── Типы данных ────────────────────────────────────────────────────────────

interface StaffItem {
  id: string;
  bio?: string | null;
  photoUrl?: string | null;
  user?: { name?: string | null; avatarUrl?: string | null };
  services?: { service: { name: string; price: number } }[];
}

interface ServiceItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  client?: { name?: string | null };
}

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  country: string;
  address?: string | null;
  phone?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  avgRating?: number | null;
  reviewCount?: number;
  staff: StaffItem[];
  services: ServiceItem[];
  reviews: ReviewItem[];
}

// ─── Загрузка данных ─────────────────────────────────────────────────────────

async function fetchBusiness(slug: string): Promise<Business | null> {
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

// ─── Страница ────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// /businesses/[slug] — публичная страница бизнеса
// Вкладки: Мастера | Услуги | Отзывы
export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await fetchBusiness(slug);

  if (!business) notFound();

  const categoryInfo = BUSINESS_CATEGORIES.find((c) => c.value === business.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ─── Шапка бизнеса ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        {/* Лого или заглушка */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center border border-border">
          {business.logoUrl ? (
            <Image src={business.logoUrl} alt={business.name} fill className="object-cover" />
          ) : (
            <span className="text-4xl">{categoryInfo?.icon || '🏪'}</span>
          )}
        </div>

        {/* Основная информация */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-2">
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground">
              {business.name}
            </h1>
            <Badge variant="outline" className="mt-1">
              {categoryInfo?.label || business.category}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {business.city}, {business.country}
            </span>
            {business.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 opacity-50" />
                {business.address}
              </span>
            )}
            {business.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {business.phone}
              </span>
            )}
            {business.avgRating && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {business.avgRating}
                <span className="text-muted-foreground font-normal">
                  ({business.reviewCount})
                </span>
              </span>
            )}
          </div>

          {business.description && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">
              {business.description}
            </p>
          )}

          {/* Два флоу записи */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Button size="sm" render={<Link href={`/businesses/${business.slug}/book?flow=service`} />}>
              Записаться по услуге
            </Button>
            <Button size="sm" variant="outline" render={<Link href={`/businesses/${business.slug}/book`} />}>
              Выбрать мастера
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Вкладки ─────────────────────────────────────────────────── */}
      <Tabs defaultValue="staff">
        <TabsList className="mb-6">
          <TabsTrigger value="staff">
            Мастера ({business.staff.length})
          </TabsTrigger>
          <TabsTrigger value="services">
            Услуги ({business.services.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Отзывы ({business.reviewCount ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Вкладка: Мастера */}
        <TabsContent value="staff">
          {business.staff.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Мастера не добавлены</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {business.staff.map((s) => (
                <StaffCard
                  key={s.id}
                  id={s.id}
                  businessSlug={business.slug}
                  name={s.user?.name ?? '—'}
                  bio={s.bio}
                  photoUrl={s.photoUrl}
                  avatarUrl={s.user?.avatarUrl}
                  services={s.services}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Вкладка: Услуги */}
        <TabsContent value="services">
          {business.services.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Услуги не добавлены</p>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {business.services.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between px-4 py-3 bg-card">
                  <div>
                    <p className="font-medium text-foreground">{svc.name}</p>
                    {svc.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {svc.duration} мин
                    </p>
                  </div>
                  <span className="text-primary font-semibold shrink-0 ml-4">
                    {Number(svc.price).toLocaleString('ru')} ₽
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Вкладка: Отзывы */}
        <TabsContent value="reviews">
          {business.reviews.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Отзывов пока нет</p>
          ) : (
            <div className="space-y-4">
              {business.reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-border p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">
                      {r.client?.name || 'Клиент'}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(r.createdAt).toLocaleDateString('ru', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
