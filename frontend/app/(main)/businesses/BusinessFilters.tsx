'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { CITIES_BY_COUNTRY } from '@/lib/constants';

interface Category {
  value: string;
  label: string;
  icon: string;
}

interface BusinessFiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedCity: string;
}

// Все города из всех стран — для выпадающего списка в каталоге
const ALL_CITIES = [
  ...CITIES_BY_COUNTRY.KZ,
  ...CITIES_BY_COUNTRY.RU,
  ...CITIES_BY_COUNTRY.BY,
  ...CITIES_BY_COUNTRY.UA,
  ...CITIES_BY_COUNTRY.UZ,
  ...CITIES_BY_COUNTRY.AM,
  ...CITIES_BY_COUNTRY.GE,
  ...CITIES_BY_COUNTRY.AZ,
  ...CITIES_BY_COUNTRY.KG,
  ...CITIES_BY_COUNTRY.MD,
].sort();

export default function BusinessFilters({
  categories,
  selectedCategory,
  selectedCity,
}: BusinessFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="space-y-3 mb-6">
      {/* Строка 1: Фильтр по категории */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => updateFilter('category', '')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !selectedCategory
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:border-primary hover:text-primary'
          }`}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() =>
              updateFilter('category', selectedCategory === cat.value ? '' : cat.value)
            }
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === cat.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary hover:text-primary'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Строка 2: Фильтр по городу — выпадающий список */}
      <div className="flex items-center gap-3">
        <select
          value={selectedCity}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="px-3 py-1.5 rounded-full text-sm border border-border focus:border-primary focus:outline-none bg-background min-w-45"
        >
          <option value="">Все города</option>
          {ALL_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Сброс фильтров */}
        {(selectedCategory || selectedCity) && (
          <button
            onClick={() => {
              const params = new URLSearchParams();
              router.push(`?${params.toString()}`);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
}
