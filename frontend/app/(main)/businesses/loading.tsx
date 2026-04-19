// loading.tsx — скелетон для страницы каталога бизнесов /businesses
// Показывается пока Server Component загружает список
export default function BusinessesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="h-9 w-48 bg-muted animate-pulse rounded-md mb-6" />

      {/* Фильтры */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 w-36 bg-muted animate-pulse rounded-md" />
        ))}
      </div>

      {/* Сетка карточек бизнесов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            {/* Изображение-заглушка */}
            <div className="h-40 bg-muted animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
