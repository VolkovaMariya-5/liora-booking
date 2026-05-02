'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { UserPlus, UserX, UserCheck, Pencil } from 'lucide-react';

interface Service {
  id: string;
  name: string;
}

interface ScheduleDay {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

const DAY_NAMES = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

interface StaffMember {
  id: string;
  bio?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  user?: { name: string; email: string; avatarUrl?: string | null };
  services?: { service: Service }[];
}

// StaffList — список мастеров с добавлением, редактированием и деактивацией
export default function StaffList({
  staff: initialStaff,
  availableServices,
}: {
  staff: StaffMember[];
  availableServices: Service[];
}) {
  const router = useRouter();
  const [staff, setStaff] = useState(initialStaff);
  const [loading, setLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Переключение активности мастера
  const toggleActive = async (member: StaffMember) => {
    const name = member.user?.name ?? 'мастера';
    if (member.isActive) {
      if (!confirm(`Деактивировать ${name}? Активные записи не будут отменены автоматически.`)) return;
    }
    setLoading(member.id);
    try {
      await api.patch(`/manage/staff/${member.id}`, { isActive: !member.isActive });
      setStaff((prev) =>
        prev.map((s) => (s.id === member.id ? { ...s, isActive: !s.isActive } : s)),
      );
      toast.success(member.isActive ? 'Мастер деактивирован' : 'Мастер активирован');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {staff.map((member) => (
        <div key={member.id}>
          {/* Карточка мастера */}
          <div
            className={`rounded-xl border p-4 flex items-center gap-4 ${
              member.isActive ? 'border-border bg-card' : 'border-border bg-muted/30 opacity-60'
            }`}
          >
            <Avatar className="w-12 h-12 shrink-0">
              <AvatarImage src={member.photoUrl || member.user?.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {member.user?.name?.charAt(0) ?? '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">{member.user?.name ?? '—'}</p>
                {!member.isActive && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Неактивен
                  </span>
                )}
              </div>
              {member.user?.email && (
                <p className="text-xs text-muted-foreground">{member.user.email}</p>
              )}
              {/* Список услуг мастера */}
              {member.services && member.services.length > 0 ? (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {member.services.map((ss) => ss.service.name).join(', ')}
                </p>
              ) : (
                <p className="text-xs text-amber-500 mt-0.5">Услуги не привязаны</p>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              {/* Кнопка редактирования */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingId(editingId === member.id ? null : member.id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              {/* Кнопка деактивации/активации */}
              <Button
                size="sm"
                variant={member.isActive ? 'destructive' : 'outline'}
                onClick={() => toggleActive(member)}
                disabled={loading === member.id}
              >
                {member.isActive ? (
                  <UserX className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Форма редактирования — раскрывается под карточкой */}
          {editingId === member.id && (
            <EditStaffForm
              member={member}
              availableServices={availableServices}
              onSuccess={(updated) => {
                setStaff((prev) =>
                  prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
                );
                setEditingId(null);
                toast.success('Данные мастера обновлены');
              }}
              onCancel={() => setEditingId(null)}
            />
          )}
        </div>
      ))}

      {/* Кнопка добавления мастера */}
      {!showAddForm && (
        <Button variant="outline" className="w-full" onClick={() => setShowAddForm(true)}>
          <UserPlus className="w-4 h-4 mr-1" /> Добавить мастера
        </Button>
      )}

      {/* Форма добавления мастера */}
      {showAddForm && (
        <AddStaffForm
          availableServices={availableServices}
          onSuccess={(newMember) => {
            setStaff((prev) => [...prev, newMember]);
            setShowAddForm(false);
            router.refresh();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

// ==================== ФОРМА РЕДАКТИРОВАНИЯ ====================

function EditStaffForm({
  member,
  availableServices,
  onSuccess,
  onCancel,
}: {
  member: StaffMember;
  availableServices: Service[];
  onSuccess: (updated: Partial<StaffMember>) => void;
  onCancel: () => void;
}) {
  const { data: session } = useSession();
  const [bio, setBio] = useState(member.bio ?? '');
  const [photoUrl, setPhotoUrl] = useState(member.photoUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    member.services?.map((ss) => ss.service.id) ?? [],
  );
  // Расписание — 7 дней, загружаем с сервера при открытии формы
  const [schedule, setSchedule] = useState<ScheduleDay[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i, startTime: '09:00', endTime: '18:00', isWorking: false,
    })),
  );
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Загружаем текущее расписание мастера при открытии формы
  useEffect(() => {
    api.get(`/manage/staff/${member.id}/schedule`)
      .then((res) => {
        const data: ScheduleDay[] = res.data;
        if (data.length > 0) {
          setSchedule(Array.from({ length: 7 }, (_, i) => {
            const existing = data.find((d) => d.dayOfWeek === i);
            return existing ?? { dayOfWeek: i, startTime: '09:00', endTime: '18:00', isWorking: false };
          }));
        }
      })
      .catch(() => {}) // если нет расписания — оставляем дефолт
      .finally(() => setScheduleLoading(false));
  }, [member.id]);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const updateScheduleDay = (dayOfWeek: number, field: keyof ScheduleDay, value: string | boolean) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d)),
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          body: formData,
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Ошибка сервера');
      }
      const data = await res.json();
      setPhotoUrl(data.url);
      toast.success('Фото загружено');
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    for (const day of schedule) {
      if (day.isWorking && day.endTime <= day.startTime) {
        toast.error(`${DAY_NAMES[day.dayOfWeek]}: время окончания должно быть позже начала`);
        return;
      }
    }
    setSaving(true);
    try {
      await Promise.all([
        api.patch(`/manage/staff/${member.id}`, {
          bio: bio || undefined,
          photoUrl: photoUrl || undefined,
          serviceIds: selectedServiceIds,
        }),
        api.put(`/manage/staff/${member.id}/schedule`, { schedule }),
      ]);
      const updatedServices = availableServices
        .filter((s) => selectedServiceIds.includes(s.id))
        .map((s) => ({ service: s }));
      onSuccess({ id: member.id, bio, photoUrl, services: updatedServices });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-b-xl border border-t-0 border-primary/30 bg-primary/5 p-4 space-y-5">
      <p className="text-sm font-semibold text-foreground">
        Редактировать: {member.user?.name}
      </p>

      {/* Фото мастера */}
      <div>
        <label className="text-xs text-muted-foreground block mb-2">Фото мастера</label>
        <div className="flex items-center gap-4">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Фото" className="w-16 h-16 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl border border-border">
              {member.user?.name?.charAt(0) ?? '?'}
            </div>
          )}
          <label className="cursor-pointer text-sm text-primary hover:underline">
            {uploading ? 'Загружаем...' : 'Загрузить фото'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={uploading}
            />
          </label>
          {photoUrl && (
            <button
              type="button"
              onClick={() => setPhotoUrl('')}
              className="text-xs text-destructive hover:underline"
            >
              Удалить
            </button>
          )}
        </div>
      </div>

      {/* Специализация */}
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Специализация / bio</label>
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Стилист-колорист с 7-летним опытом"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Привязка услуг */}
      {availableServices.length > 0 && (
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Услуги мастера</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableServices.map((service) => (
              <label key={service.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedServiceIds.includes(service.id)}
                  onChange={() => toggleService(service.id)}
                  className="w-4 h-4 accent-primary"
                />
                {service.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Расписание работы */}
      <div>
        <label className="text-xs text-muted-foreground block mb-2">Рабочие дни и часы</label>
        {scheduleLoading ? (
          <p className="text-xs text-muted-foreground">Загружаем расписание...</p>
        ) : (
          <div className="space-y-2">
            {schedule.map((day) => (
              <div key={day.dayOfWeek} className={`flex items-center gap-3 flex-wrap rounded-lg px-3 py-2 border ${day.isWorking ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                <label className="flex items-center gap-2 cursor-pointer min-w-32.5">
                  <input
                    type="checkbox"
                    checked={day.isWorking}
                    onChange={(e) => updateScheduleDay(day.dayOfWeek, 'isWorking', e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className={`text-sm ${day.isWorking ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {DAY_NAMES[day.dayOfWeek]}
                  </span>
                </label>
                {day.isWorking ? (
                  <div className="flex items-center gap-2 text-sm">
                    <input type="time" value={day.startTime}
                      onChange={(e) => updateScheduleDay(day.dayOfWeek, 'startTime', e.target.value)}
                      className="px-2 py-1 rounded-md border border-border bg-background text-sm focus:border-primary focus:outline-none"
                    />
                    <span className="text-muted-foreground">—</span>
                    <input type="time" value={day.endTime}
                      onChange={(e) => updateScheduleDay(day.dayOfWeek, 'endTime', e.target.value)}
                      className="px-2 py-1 rounded-md border border-border bg-background text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Выходной</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Отмена</Button>
      </div>
    </div>
  );
}

// ==================== ФОРМА ДОБАВЛЕНИЯ ====================

function AddStaffForm({
  availableServices,
  onSuccess,
  onCancel,
}: {
  availableServices: Service[];
  onSuccess: (member: StaffMember) => void;
  onCancel: () => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast.error('Заполните обязательные поля');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/manage/staff', {
        email,
        name,
        password,
        bio: bio || undefined,
        serviceIds: selectedServiceIds,
      });
      onSuccess(res.data);
      toast.success('Мастер добавлен');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка при добавлении');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4">
      <h3 className="font-semibold text-foreground">Новый мастер</h3>

      {/* Основные поля */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="ФИО *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
        />
        <input
          type="password"
          placeholder="Пароль * (мин. 6 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
        />
        <input
          type="text"
          placeholder="Специализация (bio)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Выбор услуг — ключевая связка мастер→услуги */}
      {availableServices.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Услуги мастера <span className="text-amber-500">(рекомендуем выбрать сразу)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableServices.map((service) => (
              <label key={service.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedServiceIds.includes(service.id)}
                  onChange={() => toggleService(service.id)}
                  className="w-4 h-4 accent-primary"
                />
                {service.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {availableServices.length === 0 && (
        <p className="text-xs text-amber-500">
          Сначала добавьте услуги в разделе «Услуги», затем вернитесь и привяжите их к мастеру.
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? 'Добавляем...' : 'Добавить мастера'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
}
