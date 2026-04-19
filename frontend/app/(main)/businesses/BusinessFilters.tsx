'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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

// BusinessFilters — клиентский компонент для интерактивной фильтрации каталога
// Обновляет URL search params без перезагрузки страницы
export default function BusinessFilters({
  categories,
  selectedCategory,
  selectedCity,
}: BusinessFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Обновляет один параметр фильтра и сбрасывает пагинацию
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page'); // сброс пагинации при смене фильтра
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Фильтр по категории */}
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

      {/* Поле ввода города */}
      <input
        type="text"
        placeholder="Город..."
        defaultValue={selectedCity}
        onBlur={(e) => updateFilter('city', e.target.value.trim())}
        onKeyDown={(e) => {
          if (e.key === 'Enter') updateFilter('city', (e.target as HTMLInputElement).value.trim());
        }}
        className="px-3 py-1.5 rounded-full text-sm border border-border focus:border-primary focus:outline-none bg-background ml-auto"
      />
    </div>
  );
}
