import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BUSINESS_CATEGORIES } from '@/lib/constants';
import { api } from '@/lib/api';
import { BusinessCard } from '@/components/businesses/BusinessCard';
import { Scissors, Clock, Star, ChevronRight } from 'lucide-react';

// Лендинг /  — главная страница Liora
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
      <section className="relative bg-linear-to-br from-primary/5 via-background to-accent/5 py-20 sm:py-28 overflow-hidden">
        {/* Декоративный круг */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-6 text-xs px-3 py-1 border-primary/30 text-primary">
            Запись без звонков
          </Badge>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground leading-tight mb-6">
            Красота начинается
            <br />
            <span className="text-primary">с одного клика</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Находите лучших мастеров рядом с вами и записывайтесь онлайн — без ожидания,
            без звонков, в любое время.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 h-12 text-base" render={<Link href="/businesses" />}>
              Найти мастера
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-base" render={<Link href="/auth/register-business" />}>
              Я — владелец бизнеса
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Как это работает ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-center mb-12">
            Записаться просто
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: <Scissors className="w-7 h-7 text-primary" />,
                step: '1',
                title: 'Выберите мастера',
                desc: 'Найдите специалиста по категории, городу или имени. Смотрите услуги и цены.',
              },
              {
                icon: <Clock className="w-7 h-7 text-primary" />,
                step: '2',
                title: 'Выберите время',
                desc: 'Выберите удобную дату и свободный слот — система покажет реальное расписание.',
              },
              {
                icon: <Star className="w-7 h-7 text-primary" />,
                step: '3',
                title: 'Подтвердите запись',
                desc: 'Получите подтверждение в личном кабинете. Мастер уже ждёт!',
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4 p-6">
                {/* Номер шага */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Категории ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold">Категории</h2>
            <Link
              href="/businesses"
              className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
              Все <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BUSINESS_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/businesses?category=${cat.value}`}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-background border border-border hover:border-primary hover:shadow-sm transition-all duration-200"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Популярные бизнесы ──────────────────────────────────────── */}
      {businesses.length > 0 && (
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold">
                Популярные места
              </h2>
              <Link
                href="/businesses"
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                Все <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-16 sm:py-20 bg-linear-to-br from-primary/5 to-accent/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold mb-4">
            Ведёте салон или студию?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Подключите ваш бизнес к Liora — управляйте записями, мастерами и расписанием
            из единого кабинета. Бесплатно.
          </p>
          <Button size="lg" className="px-10 h-12 text-base" render={<Link href="/auth/register-business" />}>
            Добавить бизнес →
          </Button>
        </div>
      </section>

    </div>
  );
}
