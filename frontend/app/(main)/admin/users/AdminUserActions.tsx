'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  city?: string | null;
  country?: string | null;
}

const ROLES = [
  { value: 'CLIENT',         label: 'Клиент' },
  { value: 'STAFF',          label: 'Мастер' },
  { value: 'BUSINESS_ADMIN', label: 'Владелец' },
  { value: 'SUPER_ADMIN',    label: 'Администратор' },
];

export function AdminUserActions({ user }: { user: User }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    city: user.city ?? '',
    country: user.country ?? '',
  });

  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/users/${user.id}`, form);
      toast.success('Сохранено');
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Удалить ${user.name}?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success('Пользователь удалён');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="contents">
      {/* Кнопки действий */}
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Изменить
        </Button>
        <Button size="sm" variant="destructive" onClick={remove} disabled={deleting}>
          Удалить
        </Button>
      </div>

      {/* Модалка редактирования */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl">
            <h2 className="font-heading text-2xl font-normal mb-5">Редактировать пользователя</h2>

            <div className="space-y-4">
              <Field label="Имя">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Роль">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputCls}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Город">
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputCls}
                    placeholder="Москва"
                  />
                </Field>
                <Field label="Страна">
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={inputCls}
                    placeholder="RU"
                  />
                </Field>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={save} disabled={saving} className="flex-1">
                {saving ? 'Сохраняем...' : 'Сохранить'}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Модалка создания нового пользователя
export function AdminCreateUserButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'CLIENT', city: '', country: '',
  });

  const create = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Заполните имя, email и пароль');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/users', form);
      toast.success('Пользователь создан');
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'CLIENT', city: '', country: '' });
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        + Создать пользователя
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl">
            <h2 className="font-heading text-2xl font-normal mb-5">Новый пользователь</h2>

            <div className="space-y-4">
              <Field label="Имя">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="Иван Иванов"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                  placeholder="user@example.com"
                />
              </Field>
              <Field label="Пароль">
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputCls}
                  placeholder="Минимум 6 символов"
                />
              </Field>
              <Field label="Роль">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputCls}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Город">
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputCls}
                    placeholder="Москва"
                  />
                </Field>
                <Field label="Страна">
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={inputCls}
                    placeholder="RU"
                  />
                </Field>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={create} disabled={saving} className="flex-1">
                {saving ? 'Создаём...' : 'Создать'}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const inputCls = 'w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}
