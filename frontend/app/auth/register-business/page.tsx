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
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { COUNTRIES, CITIES_BY_COUNTRY, BUSINESS_CATEGORIES } from '@/lib/constants';
import axios from 'axios';

// slug: только строчные буквы, цифры и дефис
const slugRegex = /^[a-z0-9-]+$/;

const registerBusinessSchema = z.object({
  name: z.string().min(2, 'Имя не менее 2 символов'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
  businessName: z.string().min(2, 'Название бизнеса не менее 2 символов'),
  slug: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(50, 'Максимум 50 символов')
    .regex(slugRegex, 'Только строчные буквы, цифры и дефис'),
  category: z.string().min(1, 'Выберите категорию'),
  country: z.string().min(1, 'Выберите страну'),
  city: z.string().min(1, 'Выберите город'),
  description: z.string().optional(),
  address: z.string().optional(),
});

type RegisterBusinessForm = z.infer<typeof registerBusinessSchema>;

export default function RegisterBusinessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const form = useForm<RegisterBusinessForm>({
    resolver: zodResolver(registerBusinessSchema),
    defaultValues: {
      name: '', email: '', password: '', businessName: '', slug: '',
      category: '', country: '', city: '', description: '', address: '',
    },
  });

  // Автоматически генерируем slug из названия бизнеса
  const handleBusinessNameChange = (value: string) => {
    form.setValue('businessName', value);
    // Транслитерация для slug: убираем специальные символы, заменяем пробелы на дефис
    const autoSlug = value
      .toLowerCase()
      .replace(/[а-яёА-ЯЁ]/g, transliterate) // кириллица → латиница
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 50);
    form.setValue('slug', autoSlug);
  };

  const handleCountryChange = (value: string | null) => {
    const country = value || '';
    setSelectedCountry(country);
    form.setValue('country', country);
    form.setValue('city', '');
  };

  const onSubmit = async (data: RegisterBusinessForm) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/register-business`,
        data,
      );

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success('Бизнес зарегистрирован! Добро пожаловать');
        router.push('/manage');
        router.refresh();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error(error.response.data?.message || 'Email или адрес уже заняты');
      } else {
        toast.error('Произошла ошибка при регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const availableCities = selectedCountry ? CITIES_BY_COUNTRY[selectedCountry] || [] : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="text-3xl font-heading font-semibold text-primary mb-2">Liora</div>
          <CardTitle className="text-xl">Зарегистрировать бизнес</CardTitle>
          <CardDescription>Создайте аккаунт и начните принимать записи онлайн</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Ваши данные
              </p>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Наталья Белова" {...field} />
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
                      <Input type="email" placeholder="owner@mybusiness.ru" {...field} />
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
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide pt-2">
                Данные бизнеса
              </p>

              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Belle Beauty Studio"
                        {...field}
                        onChange={(e) => handleBusinessNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес на платформе</FormLabel>
                    <FormControl>
                      <Input placeholder="belle-beauty" {...field} />
                    </FormControl>
                    <FormDescription>liora.app/{field.value || 'your-business'}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUSINESS_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес (необязательно)</FormLabel>
                    <FormControl>
                      <Input placeholder="ул. Тверская, 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание (необязательно)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Расскажите о вашем бизнесе..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Регистрируем...' : 'Зарегистрировать бизнес'}
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

// Простая транслитерация для генерации slug из кириллицы
function transliterate(char: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return map[char] || char;
}
