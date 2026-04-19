// loading.tsx — скелетон для страницы списка записей /bookings
export default function BookingsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-9 w-40 bg-muted animate-pulse rounded-md mb-6" />

      {/* Фильтр по статусу */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded-full" />
        ))}
      </div>

      {/* Список записей */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            </div>
            <div className="h-4 w-56 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
