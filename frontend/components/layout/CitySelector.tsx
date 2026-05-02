'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronDown } from 'lucide-react';
import { COUNTRIES, CITIES_BY_COUNTRY } from '@/lib/constants';
import { setCityPreference } from '@/app/actions/city';

interface Props {
  city: string;
  country: string;
}

const selectCls = 'w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none';

export function CitySelector({ city, country }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [selectedCity, setSelectedCity] = useState(city);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Закрываем при клике вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const cities = CITIES_BY_COUNTRY[selectedCountry] ?? [];

  const handleCountryChange = (v: string) => {
    setSelectedCountry(v);
    setSelectedCity('');
  };

  const handleApply = () => {
    if (!selectedCity) return;
    startTransition(async () => {
      await setCityPreference(selectedCity, selectedCountry);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <div ref={ref} className="relative hidden sm:block">
      {/* Триггер — текущий город */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
      >
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="max-w-32 truncate">{city}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Дропдаун */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl p-4 z-200">
          <p className="font-heading text-lg font-normal mb-1">Ваш город</p>
          <p className="text-xs text-muted-foreground mb-4">
            Показываем салоны только в выбранном городе
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Страна</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={selectCls}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Город</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={selectCls}
                disabled={!selectedCountry}
              >
                <option value="">— выберите —</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleApply}
              disabled={!selectedCity || isPending}
              className="flex-1 bg-primary text-primary-foreground rounded-full py-2 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {isPending ? 'Сохраняем…' : 'Применить'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-full border border-border text-sm hover:bg-muted transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
