'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Zod схема — описывает правила валидации формы
// Zod интегрируется с React Hook Form через @hookform/resolvers/zod
const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
});

type LoginForm = z.infer<typeof loginSchema>;

// useSearchParams требует Suspense — выносим логику в отдельный компонент
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // callbackUrl — куда перенаправить после входа (если пользователь шёл на защищённую страницу)
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [isLoading, setIsLoading] = useState(false);

  // useForm с zodResolver — автоматически валидирует поля по схеме при изменении и отправке
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // signIn('credentials') вызывает Credentials Provider из lib/auth.ts
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // не делать автоматический редирект — обрабатываем сами
      });

      if (result?.error) {
        // NestJS вернул 401 — неверные credentials
        toast.error('Неверный email или пароль');
      } else {
        toast.success('Добро пожаловать!');
        router.push(callbackUrl);
        router.refresh(); // обновляем серверные компоненты чтобы они увидели новую сессию
      }
    } catch {
      toast.error('Произошла ошибка. Попробуйте снова');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          {/* Логотип платформы */}
          <div className="text-3xl font-heading font-semibold text-primary mb-2">Liora</div>
          <CardTitle className="text-xl">Вход в аккаунт</CardTitle>
          <CardDescription>Введите ваши данные для входа</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Поле Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="anna@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> {/* Автоматически показывает ошибки валидации */}
                  </FormItem>
                )}
              />

              {/* Поле Пароль */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Входим...' : 'Войти'}
              </Button>
            </form>
          </Form>

          {/* Вход через Google */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
              <span className="bg-card px-2">или</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl })}
            type="button"
          >
            Войти через Google
          </Button>

          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>
              Нет аккаунта?{' '}
              <Link href="/auth/register" className="text-primary underline-offset-4 hover:underline">
                Зарегистрироваться
              </Link>
            </p>
            <p>
              Владелец бизнеса?{' '}
              <Link
                href="/auth/register-business"
                className="text-primary underline-offset-4 hover:underline"
              >
                Зарегистрировать бизнес
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Suspense обязателен для useSearchParams в статически рендеримых страницах Next.js
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
