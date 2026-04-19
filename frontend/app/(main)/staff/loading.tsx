// loading.tsx — скелетон для кабинета мастера /staff
export default function StaffLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-9 w-48 bg-muted animate-pulse rounded-md mb-6" />

      {/* Карточки расписания */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-4 w-full bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
