'use client';

import { COUNTRIES, CITIES_BY_COUNTRY } from '@/lib/constants';

interface Props {
  country: string;
  city: string;
  onCountryChange: (country: string, city: string) => void;
  onCityChange: (city: string) => void;
}

const selectCls = 'w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none';

// При смене страны передаём новую страну И сбрасываем город в одном callback
export function LocationSelects({ country, city, onCountryChange, onCityChange }: Props) {
  const cities = country ? (CITIES_BY_COUNTRY[country] ?? []) : [];

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Страна</label>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value, '')}
          className={selectCls}
        >
          <option value="">— выберите —</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Город</label>
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className={selectCls}
          disabled={!country}
        >
          <option value="">— выберите —</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
