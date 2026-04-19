import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Статусы записей — соответствуют enum BookingStatus в Prisma schema
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

// Цвета и подписи для каждого статуса (раздел 21.5 ТЗ)
const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Ожидает',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
  },
  CONFIRMED: {
    label: 'Подтверждено',
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  },
  CANCELLED: {
    label: 'Отменено',
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  },
  COMPLETED: {
    label: 'Завершено',
    // Фиолетовый — фирменный цвет Liora
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant="outline"
      className={cn('font-medium text-xs', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
