'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { COUNTRIES, CITIES_BY_COUNTRY } from '@/lib/constants';

interface ProfileData {
  name: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
}

interface ProfileEditFormProps {
  initialData: ProfileData;
}

// ProfileEditForm — форма редактирования личных данных (имя, телефон, город, аватар)
// Аватар загружается через /api/upload/image → Cloudinary
export default function ProfileEditForm({ initialData }: ProfileEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name ?? '');
  const [phone, setPhone] = useState(initialData.phone ?? '');
  const [country, setCountry] = useState(initialData.country ?? '');
  const [city, setCity] = useState(initialData.city ?? '');
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cities = country ? CITIES_BY_COUNTRY[country] ?? [] : [];

  // Загрузка аватара в Cloudinary через бэкенд
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatarUrl(res.data.url);
      toast.success('Фото загружено');
    } catch {
      toast.error('Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Введите имя');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/profile', {
        name: name.trim(),
        phone: phone.trim() || undefined,
        country: country || undefined,
        city: city || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      toast.success('Профиль сохранён');
      router.push('/profile');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Аватар */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Фото профиля</label>
        <div className="flex items-center gap-4">
          {avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Аватар" className="w-16 h-16 rounded-full object-cover border border-border" />
          )}
          <label className="cursor-pointer text-sm text-primary hover:underline">
            {uploading ? 'Загружаем...' : 'Выбрать фото'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Имя */}
      <Field label="Имя *">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
        />
      </Field>

      {/* Телефон */}
      <Field label="Телефон">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 000-00-00"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
        />
      </Field>

      {/* Страна */}
      <Field label="Страна">
        <select
          value={country}
          onChange={(e) => { setCountry(e.target.value); setCity(''); }}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
        >
          <option value="">— Выберите страну —</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </Field>

      {/* Город */}
      {cities.length > 0 && (
        <Field label="Город">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
          >
            <option value="">— Выберите город —</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}
