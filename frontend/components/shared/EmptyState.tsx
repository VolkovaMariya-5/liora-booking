import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  // Опциональная кнопка действия (CTA — Call To Action)
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

// EmptyState — пустое состояние когда нет данных (нет записей, нет избранных и т.д.)
// Иконка + текст + опциональная кнопка
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Иконка в круглом фоне фиолетового оттенка */}
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}

      {action && (
        <>
          {action.href ? (
            <Button render={<Link href={action.href} />}>{action.label}</Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </>
      )}
    </div>
  );
}
