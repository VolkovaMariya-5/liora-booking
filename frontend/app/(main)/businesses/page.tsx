import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { BusinessCard } from '@/components/businesses/BusinessCard';
import { BUSINESS_CATEGORIES } from '@/lib/constants';
import BusinessesLoading from './loading';
import BusinessFilters from './BusinessFilters';

const DEFAULT_CITY = 'Усть-Каменогорск';

// Тип ответа от API /businesses (data + meta)
interface BusinessListResponse {
  data: BusinessItem[];
  meta?: { total: number; page: number; limit: number; totalPages: number };
}

interface BusinessItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  logoUrl?: string | null;
  avgRating?: number | null;
  reviewCount?: number;
  staffCount?: number;
  description?: string | null;
}

// Загружаем список бизнесов с фильтрами (Server Component)
async function fetchBusinesses(params: Record<string, string>): Promise<BusinessListResponse> {
  const query = new URLSearchParams(params).toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/businesses?${query}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
    return res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

// /businesses — каталог всех бизнесов с фильтрацией
// Фильтры: категория, город; пагинация; серверный рендеринг
export default async function BusinessesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const store = await cookies();
  // Если город не выбран явно в URL — берём из cookie (предпочтение пользователя)
  const preferredCity = store.get('preferred_city')?.value ?? DEFAULT_CITY;
  const { category = '', city = preferredCity, page = '1' } = params;

  const result = await fetchBusinesses({
    ...(category && { category }),
    ...(city && { city }),
    page,
    limit: '12',
  });

  const total = result.meta?.total ?? result.data.length;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <h1 className="font-heading text-4xl font-semibold text-foreground mb-2">Каталог</h1>
      <p className="text-muted-foreground mb-6">
        {total > 0
          ? `Найдено ${total} ${getPluralForm(total, ['место', 'места', 'мест'])}`
          : category || city ? 'По этим фильтрам ничего нет' : ''}
      </p>

      {/* Фильтры — Client Component (интерактивный) */}
      <Suspense fallback={null}>
        <BusinessFilters
          categories={BUSINESS_CATEGORIES as unknown as { value: string; label: string; icon: string }[]}
          selectedCategory={category}
          selectedCity={city}
        />
      </Suspense>

      {/* Сетка карточек */}
      {result.data.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {result.data.map((b) => (
            <BusinessCard
              key={b.id}
              id={b.id}
              name={b.name}
              slug={b.slug}
              category={b.category}
              city={b.city}
              logoUrl={b.logoUrl}
              avgRating={b.avgRating}
              reviewCount={b.reviewCount}
              staffCount={b.staffCount}
              description={b.description}
            />
          ))}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === Number(page);
            const href = `?${new URLSearchParams({ ...(category && { category }), ...(city && { city }), page: String(p) }).toString()}`;
            return (
              <a
                key={p}
                href={href}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary hover:text-primary'
                }`}
              >
                {p}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Склонение числительных для русского языка
function getPluralForm(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}
