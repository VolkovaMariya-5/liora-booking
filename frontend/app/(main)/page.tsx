import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BUSINESS_CATEGORIES } from '@/lib/constants';
import { api } from '@/lib/api';
import { BusinessCard } from '@/components/businesses/BusinessCard';
import { ArrowRight, ChevronRight } from 'lucide-react';

// Лендинг / — главная страница Liora
// Секции: Hero, Как это работает, Категории, Популярные бизнесы, Для владельцев

// Получаем 6 популярных бизнесов (Server Component)
async function getPopularBusinesses() {
  try {
    const res = await api.get('/businesses?limit=6&page=1');
    return res.data?.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const businesses = await getPopularBusinesses();

  return (
    <div className="flex flex-col">

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4 sm:px-8 py-24 overflow-hidden">
        {/* Тонкое радиальное свечение сверху — едва заметный фиолетовый отблеск */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.52 0.12 295 / 0.07) 0%, transparent 70%)' }}
        />

        {/* Метка-пилюля */}
        <div className="mb-10 inline-flex items-center gap-2 border border-border rounded-full px-5 py-1.5 text-xs tracking-widest uppercase text-muted-foreground">
          Онлайн-запись к мастерам
        </div>

        {/* Главный заголовок — oversized editorial serif */}
        {/* font-light (300) на Cormorant Garamond даёт изящный люксовый вид */}
        <h1
          className="font-heading font-light text-foreground mb-8 leading-[0.92] tracking-[-0.02em] max-w-5xl"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8.5rem)' }}
        >
          Красота начинается<br />
          <em className="text-primary not-italic">с одного клика</em>
        </h1>

        {/* Подзаголовок */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed mb-12">
          Находите лучших мастеров рядом с вами и записывайтесь онлайн — без ожидания, в любое время.
        </p>

        {/* CTA-кнопки */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            size="lg"
            className="px-9 h-12 text-sm tracking-wide rounded-full"
            render={<Link href="/businesses" />}
          >
            Найти мастера
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-9 h-12 text-sm tracking-wide rounded-full"
            render={<Link href="/auth/register-business" />}
          >
            Я — владелец бизнеса
          </Button>
        </div>

        {/* Тонкая разделительная линия снизу */}
        <div className="absolute bottom-0 left-[8%] right-[8%] h-px bg-border" />
      </section>

      {/* ─── Как это работает ─────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">

          {/* Верхний ярлык + заголовок секции */}
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
            Как это работает
          </p>
          <h2 className="font-heading font-light text-foreground mb-16 sm:mb-20 max-w-xl leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            Записаться просто
          </h2>

          {/* Три шага — разделены вертикальными линиями на десктопе */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              {
                num: '01',
                title: 'Выберите мастера',
                desc: 'Найдите специалиста по категории, городу или имени. Смотрите услуги и цены.',
              },
              {
                num: '02',
                title: 'Выберите время',
                desc: 'Выберите удобную дату и свободный слот — система покажет реальное расписание.',
              },
              {
                num: '03',
                title: 'Подтвердите запись',
                desc: 'Получите подтверждение в личном кабинете. Мастер уже ждёт!',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="px-0 sm:px-10 py-10 sm:py-0 first:sm:pl-0 last:sm:pr-0"
              >
                {/* Крупный декоративный номер в Cormorant */}
                <span
                  className="font-heading font-light text-primary/25 leading-none block mb-6"
                  style={{ fontSize: 'clamp(4rem, 8vw, 6rem)' }}
                >
                  {item.num}
                </span>
                <h3 className="font-heading font-medium text-foreground mb-3 text-xl sm:text-2xl">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Категории ───────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex items-end justify-between mb-12 sm:mb-16">
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                Все направления
              </p>
              <h2
                className="font-heading font-light text-foreground leading-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                Категории
              </h2>
            </div>
            <Link
              href="/businesses"
              className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Смотреть все <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {BUSINESS_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/businesses?category=${cat.value}`}
                className="group flex flex-col gap-4 p-6 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/[0.03] transition-all duration-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Популярные бизнесы ──────────────────────────────────────── */}
      {businesses.length > 0 && (
        <section className="py-24 sm:py-32 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="flex items-end justify-between mb-12 sm:mb-16">
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                  Рекомендуем
                </p>
                <h2
                  className="font-heading font-light text-foreground leading-tight"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  Популярные места
                </h2>
              </div>
              <Link
                href="/businesses"
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Все места <ChevronRight className="w-4 h-4" />
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

      {/* ─── Для владельцев бизнеса ──────────────────────────────────── */}
      {/* Тёмная секция (primary) — сильный контраст, финальный призыв к действию */}
      <section className="py-24 sm:py-32 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-xs tracking-widest uppercase text-primary-foreground/50 mb-6">
            Для бизнеса
          </p>
          <h2
            className="font-heading font-light text-primary-foreground mb-6 leading-[0.95]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
          >
            Ведёте салон<br />или студию?
          </h2>
          <p className="text-primary-foreground/65 text-lg mb-10 leading-relaxed max-w-md mx-auto">
            Подключите ваш бизнес к Liora — управляйте записями, мастерами и расписанием из единого кабинета. Бесплатно.
          </p>
          <Button
            size="lg"
            className="px-10 h-12 text-sm tracking-wide rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            render={<Link href="/auth/register-business" />}
          >
            Добавить бизнес
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

    </div>
  );
}
