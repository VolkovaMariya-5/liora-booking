import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Кастомная 404 страница
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-heading text-8xl font-light text-primary/20 leading-none mb-4">404</p>
      <h1 className="font-heading text-3xl font-normal text-foreground mb-3">
        Страница не найдена
      </h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Возможно, ссылка устарела или страница была удалена.
      </p>
      <Button render={<Link href="/" />}>На главную</Button>
    </div>
  );
}
