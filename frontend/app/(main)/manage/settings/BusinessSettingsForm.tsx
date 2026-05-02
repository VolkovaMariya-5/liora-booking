'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { revalidateBusinesses } from '@/app/actions/revalidate';

interface BusinessSettings {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  maxAdvanceBookingDays: number;
}

// BusinessSettingsForm — форма редактирования настроек бизнеса
// Поля: описание, адрес, телефон, лого, горизонт записи (maxAdvanceBookingDays)
export default function BusinessSettingsForm({ initialData }: { initialData: BusinessSettings }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [description, setDescription] = useState(initialData.description ?? '');
  const [address, setAddress] = useState(initialData.address ?? '');
  const [phone, setPhone] = useState(initialData.phone ?? '');
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl ?? '');
  const [maxDays, setMaxDays] = useState(String(initialData.maxAdvanceBookingDays));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Загрузка логотипа — fetch напрямую с токеном из сессии
  // (axios interceptor вызывает getSession() асинхронно и может упасть до запроса)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = (session as any)?.accessToken;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData, // fetch сам выставит Content-Type с boundary
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Ошибка сервера');
      }
      const data = await res.json();
      setLogoUrl(data.url);
      toast.success('Логотип загружен');
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось загрузить логотип');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const days = Number(maxDays);
    if (days < 1 || days > 365) {
      toast.error('Горизонт записи: от 1 до 365 дней');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/manage/settings', {
        description: description.trim() || undefined,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        logoUrl: logoUrl || undefined,
        maxAdvanceBookingDays: days,
      });
      toast.success('Настройки сохранены');
      await revalidateBusinesses(); // сбрасываем кэш каталога
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Название (только для информации, не редактируется) */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Название</label>
        <p className="text-foreground font-medium">{initialData.name}</p>
      </div>

      {/* Логотип */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Логотип</label>
        <div className="flex items-center gap-4">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Логотип" className="w-16 h-16 rounded-xl object-cover border border-border" />
          )}
          <label className="cursor-pointer text-sm text-primary hover:underline">
            {uploading ? 'Загружаем...' : 'Выбрать файл'}
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Описание */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Расскажите о вашем бизнесе..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      {/* Адрес */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Адрес</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ул. Пушкина, д. 10"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Телефон */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Телефон</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 000-00-00"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Горизонт записи */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Горизонт записи (дней вперёд)
        </label>
        <input
          type="number"
          value={maxDays}
          onChange={(e) => setMaxDays(e.target.value)}
          min={1}
          max={365}
          className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Клиенты смогут записываться не дальше чем на {maxDays} дней вперёд
        </p>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? 'Сохраняем...' : 'Сохранить настройки'}
      </Button>
    </form>
  );
}
