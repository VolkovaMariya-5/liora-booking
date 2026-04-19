// loading.tsx — скелетон для панели супер-администратора /admin
export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-9 w-40 bg-muted animate-pulse rounded-md mb-6" />

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-5 space-y-2">
            <div className="h-4 w-28 bg-muted animate-pulse rounded" />
            <div className="h-10 w-20 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Таблица */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="h-12 bg-muted/50 animate-pulse" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 border-t border-border px-4 flex items-center gap-4">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/5 bg-muted animate-pulse rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
