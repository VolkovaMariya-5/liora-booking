import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { BUSINESS_CATEGORIES } from '@/lib/constants';
import { BusinessCard } from '@/components/businesses/BusinessCard';
import { ChevronRight } from 'lucide-react';
const DEFAULT_CITY = 'Усть-Каменогорск';

export const dynamic = 'force-dynamic';

// Лендинг / — главная страница Liora

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getTopBusinesses(city: string) {
  try {
    const cityParam = encodeURIComponent(city);
    // Сначала ТОП в этом городе
    const res = await fetch(`${API}/businesses?featured=true&city=${cityParam}&limit=8`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const items = json?.data ?? [];
    if (items.length > 0) return items;
    // Fallback — все салоны этого города
    const fallback = await fetch(`${API}/businesses?city=${cityParam}&limit=8`, { cache: 'no-store' });
    if (!fallback.ok) return [];
    const fb = await fallback.json();
    return fb?.data ?? [];
  } catch {
    return [];
  }
}

// Emoji-карта категорий для журнала мастеров
const CAT_ICON = Object.fromEntries(BUSINESS_CATEGORIES.map((c) => [c.value, c.icon]));

const IMG = {
  hair:    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=80',
  nails:   'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=80',
  lash:    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=700&q=80',
  barber:  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&q=80',
  face:    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&q=80',
  spa:     'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=700&q=80',
  fitness: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=80',
  brows:   'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=700&q=80',
  master:  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
};

export default async function HomePage() {
  const store = await cookies();
  const city = store.get('preferred_city')?.value ?? DEFAULT_CITY;
  const businesses = await getTopBusinesses(city);

  return (
    <div className="flex flex-col bg-background">

      {/* ─── Hero — центрированный, без виджета ──────────────────────── */}
      <section className="px-5 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-6">
            — ваша запись, без звонков
          </div>
          <h1
            className="font-heading font-normal text-foreground leading-[0.97] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.03em' }}
          >
            Мастера и салоны<br />
            <em className="italic text-primary">вашего города</em>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
            Записывайтесь к проверенным мастерам в несколько кликов.
            Рейтинг, живые работы и реальные отзывы — в одном месте.
          </p>
          <div className="flex items-center justify-center">
            <Button size="lg" className="px-8 h-12 text-sm rounded-full" render={<Link href="/businesses" />}>
              Найти мастера →
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Bento-категории ─────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-5">
            <h2
              className="font-heading font-normal text-foreground"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em' }}
            >
              Категории
            </h2>
            <span className="text-sm text-muted-foreground hidden sm:block">10 направлений · 840+ мест</span>
          </div>

          {/* Bento grid — 6 колонок на десктопе, 2 на мобиле */}
          <div className="grid grid-cols-2 lg:grid-cols-6 auto-rows-[140px] lg:auto-rows-[200px] gap-3">

            {/* Большая плитка — Красота (3 cols, 2 rows на десктопе) */}
            <Link
              href="/businesses?category=HAIR_SALON"
              className="col-span-2 lg:col-span-3 row-span-2 rounded-2xl overflow-hidden relative group"
            >
              <Image src={IMG.hair} alt="Красота" fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute left-5 bottom-5 text-white">
                <div className="font-heading text-3xl lg:text-4xl font-normal">Красота</div>
                <div className="text-xs text-white/75 mt-1">Парикмахерские, бровисты, визажисты · 312 мест</div>
              </div>
              <div className="absolute right-4 top-4 bg-background/90 text-foreground text-[10px] font-medium px-2.5 py-1 rounded-full">
                ⭐ Популярно
              </div>
            </Link>

            {/* Средняя плитка — Ногти */}
            <Link
              href="/businesses?category=NAIL_STUDIO"
              className="col-span-2 lg:col-span-3 bg-accent/15 rounded-2xl overflow-hidden relative flex group hover:bg-accent/20 transition-colors"
            >
              <div className="p-4 lg:p-5 flex-1">
                <div className="font-heading font-normal text-foreground text-xl lg:text-2xl">Ногти</div>
                <div className="text-xs text-muted-foreground mt-1">186 мест</div>
              </div>
              <div className="w-24 lg:w-32 relative shrink-0">
                <Image src={IMG.nails} alt="Ногти" fill className="object-cover" unoptimized />
              </div>
            </Link>

            {/* Средняя плитка — Ресницы */}
            <Link
              href="/businesses?category=LASH_STUDIO"
              className="col-span-2 lg:col-span-3 bg-muted rounded-2xl overflow-hidden relative flex group hover:bg-muted/70 transition-colors"
            >
              <div className="p-4 lg:p-5 flex-1">
                <div className="font-heading font-normal text-foreground text-xl lg:text-2xl">Ресницы</div>
                <div className="text-xs text-muted-foreground mt-1">94 места</div>
              </div>
              <div className="w-24 lg:w-32 relative shrink-0">
                <Image src={IMG.lash} alt="Ресницы" fill className="object-cover" unoptimized />
              </div>
            </Link>

            {/* Маленькие плитки — полноэкранное фото с градиентом */}
            {[
              { n: 'Брови',  c: 72,  href: '/businesses?category=BEAUTY_SALON', img: IMG.brows   },
              { n: 'Барбер', c: 58,  href: '/businesses?category=BARBERSHOP',   img: IMG.barber  },
              { n: 'Лицо',   c: 104, href: '/businesses?category=BEAUTY_SALON', img: IMG.face    },
              { n: 'Фитнес', c: 68,  href: '/businesses?category=FITNESS',      img: IMG.fitness },
              { n: 'Спа',    c: 29,  href: '/businesses?category=SPA',          img: IMG.spa     },
              { n: 'Все',    c: 840, href: '/businesses',                       img: IMG.master  },
            ].map((c) => (
              <Link
                key={c.n}
                href={c.href}
                className="col-span-1 rounded-2xl overflow-hidden relative group"
              >
                <Image
                  src={c.img}
                  alt={c.n}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3 text-white">
                  <div className="text-xs lg:text-sm font-semibold leading-snug">{c.n}</div>
                  <div className="text-[10px] text-white/70 mt-0.5">{c.c} мест</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ─── ТОП Салоны — карточки ───────────────────────────────────── */}
      {businesses.length > 0 && (
        <section className="px-5 sm:px-10 lg:px-16 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline justify-between mb-6">
              <h2
                className="font-heading font-normal text-foreground"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em' }}
              >
                ТОП Салоны
              </h2>
              <Link href="/businesses" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Смотреть все <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {businesses.map((b: any) => (
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
          </div>
        </section>
      )}

      {/* ─── Для бизнеса ─────────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 lg:px-16 py-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-primary-foreground/45 mb-4">
                Для владельцев салонов
              </div>
              <h2
                className="font-heading font-normal text-primary-foreground leading-tight mb-5"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
              >
                Ваш салон<br />
                <em className="italic">заслуживает</em><br />
                большего
              </h2>
              <p className="text-primary-foreground/60 leading-relaxed max-w-md mb-8">
                Управляйте записями, мастерами и расписанием из единого кабинета.
                Без комиссий и скрытых платежей.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth/register-business"
                  className="inline-flex items-center gap-2 px-8 h-12 text-sm font-medium rounded-full bg-primary-foreground text-primary hover:bg-muted transition-colors"
                >
                  Подключить бесплатно →
                </Link>
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { val: '+38%',   desc: 'Рост загрузки мастеров в первый месяц' },
                { val: '0 ₽',    desc: 'Комиссий с записей клиентов. Никогда.' },
                { val: '24/7',   desc: 'Клиенты записываются даже ночью — без вас' },
                { val: '12 мин', desc: 'Среднее время на подключение салона' },
              ].map((s) => (
                <div key={s.val} className="pt-5 border-t border-primary-foreground/20">
                  <div
                    className="font-heading font-normal text-primary-foreground mb-2"
                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em' }}
                  >
                    {s.val}
                  </div>
                  <div className="text-xs text-primary-foreground/50 leading-snug">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
