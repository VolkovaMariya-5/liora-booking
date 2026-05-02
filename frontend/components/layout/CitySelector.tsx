'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, MapPin } from 'lucide-react';
import { COUNTRIES, CITIES_BY_COUNTRY } from '@/lib/constants';
import { setCityPreference } from '@/app/actions/city';

interface Props {
  city: string;
  country: string;
}

const selectCls = 'w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none';

export function CitySelector({ city, country }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [selectedCity, setSelectedCity] = useState(city);
  const [isPending, startTransition] = useTransition();

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
    <>
      {/* Кнопка в хедере — показывает текущий город */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span className="max-w-28 truncate">{city}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {/* Модал выбора города */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-heading text-2xl font-normal mb-1">Выберите город</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Будем показывать салоны только в вашем городе
            </p>

            <div className="space-y-3">
              {/* Страна */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Страна</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className={selectCls}
                >
                  <option value="">— выберите —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Город */}
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

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleApply}
                disabled={!selectedCity || isPending}
                className="flex-1 bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-medium disabled:opacity-50 transition-opacity"
              >
                {isPending ? 'Сохраняем...' : 'Применить'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
