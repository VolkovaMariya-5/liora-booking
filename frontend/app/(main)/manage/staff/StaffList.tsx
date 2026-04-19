'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { UserPlus, UserX, UserCheck } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  bio?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  user?: { email: string };
  staffServices?: { service: { name: string } }[];
}

// StaffList — список мастеров с кнопками активации/деактивации
// При деактивации с активными записями показывается предупреждение
export default function StaffList({ staff: initialStaff }: { staff: StaffMember[] }) {
  const router = useRouter();
  const [staff, setStaff] = useState(initialStaff);
  const [loading, setLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Переключение активности мастера
  const toggleActive = async (member: StaffMember) => {
    if (member.isActive) {
      if (!confirm(`Деактивировать мастера ${member.name}? Активные записи не будут отменены автоматически.`)) return;
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
        <div
          key={member.id}
          className={`rounded-xl border p-4 flex items-center gap-4 ${
            member.isActive ? 'border-border bg-card' : 'border-border bg-muted/30 opacity-60'
          }`}
        >
          <Avatar className="w-12 h-12 shrink-0">
            <AvatarImage src={member.photoUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {member.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{member.name}</p>
              {!member.isActive && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  Неактивен
                </span>
              )}
            </div>
            {member.user?.email && (
              <p className="text-xs text-muted-foreground">{member.user.email}</p>
            )}
            {member.staffServices && member.staffServices.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {member.staffServices.map((ss) => ss.service.name).join(', ')}
              </p>
            )}
          </div>

          <Button
            size="sm"
            variant={member.isActive ? 'destructive' : 'outline'}
            onClick={() => toggleActive(member)}
            disabled={loading === member.id}
          >
            {member.isActive ? (
              <><UserX className="w-4 h-4 mr-1" /> Деактивировать</>
            ) : (
              <><UserCheck className="w-4 h-4 mr-1" /> Активировать</>
            )}
          </Button>
        </div>
      ))}

      {/* Кнопка добавления мастера */}
      <Button variant="outline" className="w-full" onClick={() => setShowAddForm(true)}>
        <UserPlus className="w-4 h-4 mr-1" /> Добавить мастера
      </Button>

      {/* Форма добавления — минимальная, полная форма в отдельной странице */}
      {showAddForm && (
        <AddStaffForm
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

// Форма быстрого добавления мастера
function AddStaffForm({ onSuccess, onCancel }: {
  onSuccess: (member: StaffMember) => void;
  onCancel: () => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast.error('Заполните обязательные поля');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/manage/staff', { email, name, password, bio: bio || undefined });
      onSuccess(res.data);
      toast.success('Мастер добавлен');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка при добавлении');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
      <h3 className="font-semibold text-foreground">Новый мастер</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Имя *"
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
          placeholder="Пароль *"
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
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? 'Добавляем...' : 'Добавить'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
}
