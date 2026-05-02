'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/constants';

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  isActive: boolean;
}

// ServicesList — список услуг с inline-формой добавления и редактирования
export default function ServicesList({ services: initialServices, businessCountry }: { services: Service[]; businessCountry?: string | null }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [editing, setEditing] = useState<string | null>(null); // id редактируемой услуги
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '60' });
  const [saving, setSaving] = useState(false);

  const resetForm = () => setForm({ name: '', description: '', price: '', duration: '60' });

  // Добавление новой услуги — принимает данные напрямую (не из stale state)
  const handleAdd = async (data: { name: string; description?: string; price: number; duration: number }) => {
    if (!data.name.trim() || !data.price) {
      toast.error('Введите название и цену');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/manage/services', {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        price: Number(data.price),
        duration: Number(data.duration),
      });
      setServices((prev) => [...prev, res.data]);
      setShowAdd(false);
      resetForm();
      toast.success('Услуга добавлена');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  // Удаление/деактивация услуги
  const handleDelete = async (id: string) => {
    if (!confirm('Удалить услугу?')) return;
    try {
      await api.delete(`/manage/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Услуга удалена');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Не удалось удалить');
    }
  };

  return (
    <div className="space-y-3">
      {/* Список услуг */}
      {services.map((svc) => (
        <div key={svc.id} className="rounded-xl border border-border bg-card p-4">
          {editing === svc.id ? (
            // Inline редактирование
            <ServiceForm
              initial={svc}
              onSave={async (data) => {
                setSaving(true);
                try {
                  const res = await api.patch(`/manage/services/${svc.id}`, data);
                  setServices((prev) => prev.map((s) => (s.id === svc.id ? res.data : s)));
                  setEditing(null);
                  toast.success('Сохранено');
                } catch (err: any) {
                  toast.error(err?.response?.data?.message || 'Ошибка');
                } finally {
                  setSaving(false);
                }
              }}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{svc.name}</p>
                {svc.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-0.5">
                  {svc.duration} мин · {formatPrice(svc.price, businessCountry)}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditing(svc.id)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Редактировать"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(svc.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                  aria-label="Удалить"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Форма добавления */}
      {showAdd ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <ServiceForm
            onSave={handleAdd}
            onCancel={() => { setShowAdd(false); resetForm(); }}
            saving={saving}
          />
        </div>
      ) : (
        <Button variant="outline" onClick={() => setShowAdd(true)} className="w-full">
          <Plus className="w-4 h-4 mr-1" /> Добавить услугу
        </Button>
      )}
    </div>
  );
}

// Переиспользуемая форма для добавления/редактирования услуги
function ServiceForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: { name: string; description?: string | null; price: number; duration: number };
  onSave: (data: { name: string; description?: string; price: number; duration: number }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [duration, setDurationMin] = useState(String(initial?.duration ?? '60'));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <input
        placeholder="Название услуги *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
      />
      <input
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
      />
      <input
        type="number"
        placeholder="Цена *"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
      />
      <input
        type="number"
        placeholder="Длительность (мин)"
        value={duration}
        onChange={(e) => setDurationMin(e.target.value)}
        className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
      />
      <div className="sm:col-span-2 flex gap-2">
        <Button
          size="sm"
          onClick={() => onSave({ name, description: description || undefined, price: Number(price), duration: Number(duration) })}
          disabled={saving || !name.trim() || !price}
        >
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Отмена</Button>
      </div>
    </div>
  );
}
