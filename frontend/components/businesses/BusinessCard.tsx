import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BUSINESS_CATEGORIES } from '@/lib/constants';

interface BusinessCardProps {
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

// BusinessCard — карточка бизнеса в каталоге (/businesses)
// Отображает: лого, название, категорию, город, рейтинг, количество мастеров
export function BusinessCard({
  name, slug, category, city, logoUrl,
  avgRating, reviewCount = 0, staffCount = 0, description,
}: BusinessCardProps) {
  const categoryInfo = BUSINESS_CATEGORIES.find((c) => c.value === category);

  return (
    <Link href={`/businesses/${slug}`} className="block group">
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border">
        {/* Шапка карточки — лого или заглушка с иконкой категории */}
        <div className="relative h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          {logoUrl ? (
            <Image src={logoUrl} alt={name} fill className="object-cover" />
          ) : (
            <span className="text-5xl">{categoryInfo?.icon || '🏪'}</span>
          )}

          {/* Бейдж категории поверх изображения */}
          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground text-xs">
            {categoryInfo?.label || category}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Название бизнеса */}
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Описание */}
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}

          {/* Мета-информация: город, мастера, рейтинг */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {/* Город */}
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {city}
              </span>
              {/* Количество мастеров */}
              {staffCount > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {staffCount}
                </span>
              )}
            </div>

            {/* Рейтинг — показываем если есть отзывы */}
            {avgRating && (
              <span className="flex items-center gap-1 text-xs font-medium">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {avgRating}
                <span className="text-muted-foreground font-normal">({reviewCount})</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
