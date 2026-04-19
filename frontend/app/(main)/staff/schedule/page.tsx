import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ScheduleEditor from './ScheduleEditor';

interface ScheduleDay {
  dayOfWeek: number; // 0=Вс, 1=Пн, ..., 6=Сб
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

// Загружаем расписание мастера
async function fetchSchedule(token: string): Promise<ScheduleDay[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/me/schedule`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return getDefaultSchedule();
    return res.json();
  } catch {
    return getDefaultSchedule();
  }
}

// Шаблон расписания по умолчанию — Пн-Пт 9:00-18:00
function getDefaultSchedule(): ScheduleDay[] {
  return Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    startTime: '09:00',
    endTime: '18:00',
    isWorking: i >= 1 && i <= 5, // Пн-Пт
  }));
}

// /staff/schedule — редактор рабочего расписания мастера (Phase 7)
export default async function StaffSchedulePage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  if ((session.user as any).role !== 'STAFF') redirect('/dashboard');

  const schedule = await fetchSchedule(session.accessToken as string);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-semibold mb-2">Моё расписание</h1>
      <p className="text-muted-foreground mb-6">
        Укажите рабочие дни и часы. Клиенты смогут записаться только в доступное время.
      </p>
      <ScheduleEditor initialSchedule={schedule} />
    </div>
  );
}
