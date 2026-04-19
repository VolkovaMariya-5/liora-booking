import Link from 'next/link';
import { BUSINESS_CATEGORIES } from '@/lib/constants';

// Footer — подвал сайта с навигацией и копирайтом
// Отображается на всех публичных страницах через RootLayout
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Бренд */}
          <div className="space-y-3">
            <Link href="/" className="font-heading text-2xl font-semibold text-primary">
              Liora
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Онлайн-запись к мастерам красоты. Быстро, удобно, без звонков.
            </p>
          </div>

          {/* Для клиентов */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Клиентам
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/businesses" className="hover:text-foreground transition-colors">
                  Каталог мастеров
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-foreground transition-colors">
                  Войти
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-foreground transition-colors">
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>

          {/* Для бизнеса */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Бизнесу
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/register-business" className="hover:text-foreground transition-colors">
                  Зарегистрировать бизнес
                </Link>
              </li>
              <li>
                <Link href="/manage" className="hover:text-foreground transition-colors">
                  Кабинет владельца
                </Link>
              </li>
            </ul>
          </div>

          {/* Категории */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Категории
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {BUSINESS_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={`/businesses?category=${cat.value}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {cat.icon} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {year} Liora. Все права защищены.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
