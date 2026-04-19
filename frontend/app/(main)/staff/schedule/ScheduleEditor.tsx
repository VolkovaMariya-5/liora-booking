'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const DAY_NAMES = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

interface ScheduleDay {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

// ScheduleEditor — редактор расписания мастера по дням недели
// Каждый день: чекбокс «рабочий», время начала и окончания
export default function ScheduleEditor({ initialSchedule }: { initialSchedule: ScheduleDay[] }) {
  const [schedule, setSchedule] = useState<ScheduleDay[]>(() => {
    // Заполняем пробелы дефолтными значениями если какого-то дня нет
    return Array.from({ length: 7 }, (_, i) => {
      const existing = initialSchedule.find((s) => s.dayOfWeek === i);
      return existing ?? { dayOfWeek: i, startTime: '09:00', endTime: '18:00', isWorking: false };
    });
  });
  const [saving, setSaving] = useState(false);

  const update = (dayOfWeek: number, field: keyof ScheduleDay, value: string | boolean) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d)),
    );
  };

  const handleSave = async () => {
    // Проверяем что у рабочих дней endTime > startTime
    for (const day of schedule) {
      if (day.isWorking && day.endTime <= day.startTime) {
        toast.error(`${DAY_NAMES[day.dayOfWeek]}: время окончания должно быть позже начала`);
        return;
      }
    }
    setSaving(true);
    try {
      await api.put('/staff/me/schedule', { schedule });
      toast.success('Расписание сохранено');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Не удалось сохранить расписание');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {schedule.map((day) => (
        <div
          key={day.dayOfWeek}
          className={`rounded-xl border p-4 transition-colors ${
            day.isWorking ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
          }`}
        >
          <div className="flex items-center gap-4 flex-wrap">
            {/* Чекбокс рабочего дня */}
            <label className="flex items-center gap-2 cursor-pointer min-w-[140px]">
              <input
                type="checkbox"
                checked={day.isWorking}
                onChange={(e) => update(day.dayOfWeek, 'isWorking', e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className={`text-sm font-medium ${day.isWorking ? 'text-foreground' : 'text-muted-foreground'}`}>
                {DAY_NAMES[day.dayOfWeek]}
              </span>
            </label>

            {/* Время — только для рабочих дней */}
            {day.isWorking && (
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => update(day.dayOfWeek, 'startTime', e.target.value)}
                  className="px-2 py-1 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => update(day.dayOfWeek, 'endTime', e.target.value)}
                  className="px-2 py-1 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {!day.isWorking && (
              <span className="text-xs text-muted-foreground">Выходной</span>
            )}
          </div>
        </div>
      ))}

      <Button onClick={handleSave} disabled={saving} className="mt-4">
        {saving ? 'Сохраняем...' : 'Сохранить расписание'}
      </Button>
    </div>
  );
}
