'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { COUNTRIES, CITIES_BY_COUNTRY } from '@/lib/constants';
import axios from 'axios';

const registerSchema = z.object({
  name: z.string().min(2, 'Имя не менее 2 символов'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', phone: '', country: '', city: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // 1. Регистрируемся через NestJS API
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/register`,
        data,
      );

      // 2. После успешной регистрации сразу входим через NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success('Аккаунт создан! Добро пожаловать в Liora');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error('Пользователь с таким email уже существует');
      } else {
        toast.error('Произошла ошибка при регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // При смене страны — сбрасываем город (список городов зависит от страны)
  const handleCountryChange = (value: string | null) => {
    const country = value || '';
    setSelectedCountry(country);
    form.setValue('country', country);
    form.setValue('city', '');
  };

  const availableCities = selectedCountry ? CITIES_BY_COUNTRY[selectedCountry] || [] : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="text-3xl font-heading font-semibold text-primary mb-2">Liora</div>
          <CardTitle className="text-xl">Создать аккаунт</CardTitle>
          <CardDescription>Зарегистрируйтесь чтобы начать записываться</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Анна Смирнова" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="anna@example.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон (необязательно)</FormLabel>
                    <FormControl>
                      <Input placeholder="+79001234567" autoComplete="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Страна — выпадающий список для персонализации контента */}
              <FormField
                control={form.control}
                name="country"
                render={() => (
                  <FormItem>
                    <FormLabel>Страна</FormLabel>
                    <Select onValueChange={handleCountryChange} value={selectedCountry}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите страну" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Город — зависит от выбранной страны */}
              {availableCities.length > 0 && (
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Город</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите город" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
