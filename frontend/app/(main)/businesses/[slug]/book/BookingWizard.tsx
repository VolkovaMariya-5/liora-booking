'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Stepper } from '@/components/shared/Stepper';
import { DayPicker } from '@/components/shared/DayPicker';
import { TimeSlot } from '@/components/shared/TimeSlot';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

// ─── Типы ─────────────────────────────────────────────────────────────────

interface StaffOption {
  id: string;
  name: string;
  bio?: string | null;
  photoUrl?: string | null;
  staffServices?: { service: { id: string; name: string; price: number; durationMin: number } }[];
}

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  durationMin: number;
}

interface BookingWizardProps {
  businessSlug: string;
  businessName: string;
  staffList: StaffOption[];
  maxAdvanceDays: number;
}

// Шаги формы (раздел 11 ТЗ) — массив объектов для компонента Stepper
const STEPS = [
  { label: 'Мастер' },
  { label: 'Услуги' },
  { label: 'Дата и время' },
  { label: 'Контакты' },
  { label: 'Подтверждение' },
];

// ─── Компонент ────────────────────────────────────────────────────────────

// BookingWizard — 5-шаговая форма онлайн-записи
// Состояние хранится в useState, данные передаются между шагами без URL
export default function BookingWizard({
  businessSlug,
  businessName,
  staffList,
  maxAdvanceDays,
}: BookingWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // ── Состояние формы ──────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState<StaffOption | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [phone, setPhone] = useState(session?.user ? '' : '');
  const [name, setName] = useState(session?.user?.name || '');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Предвыбор мастера из URL параметра ?staffId=
  useEffect(() => {
    const staffId = searchParams.get('staffId');
    if (staffId) {
      const found = staffList.find((s) => s.id === staffId);
      if (found) {
        setSelectedStaff(found);
        setStep(1); // сразу переходим к шагу выбора услуг
      }
    }
  }, [searchParams, staffList]);

  // Доступные услуги выбранного мастера
  const staffServices: ServiceOption[] = selectedStaff?.staffServices?.map((ss) => ss.service) ?? [];

  // Суммарная длительность выбранных услуг (в минутах)
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.durationMin, 0);

  // Суммарная стоимость
  const totalPrice = selectedServices.reduce((acc, s) => acc + Number(s.price), 0);

  // ── Загрузка доступных слотов при выборе даты ──────────────────────
  const loadSlots = useCallback(
    async (date: string) => {
      if (!selectedStaff || selectedServices.length === 0) return;
      setSlotsLoading(true);
      try {
        const serviceIds = selectedServices.map((s) => s.id).join(',');
        const res = await api.get(
          `/staff/${selectedStaff.id}/available-slots?date=${date}&serviceIds=${serviceIds}`,
        );
        setAvailableSlots(res.data ?? []);
      } catch {
        setAvailableSlots([]);
        toast.error('Не удалось загрузить расписание');
      } finally {
        setSlotsLoading(false);
      }
    },
    [selectedStaff, selectedServices],
  );

  useEffect(() => {
    if (selectedDate) {
      loadSlots(selectedDate);
      setSelectedTime(null); // сброс времени при смене даты
    }
  }, [selectedDate, loadSlots]);

  // ── Переключение услуги (чекбокс) ──────────────────────────────────
  const toggleService = (svc: ServiceOption) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === svc.id)
        ? prev.filter((s) => s.id !== svc.id)
        : [...prev, svc],
    );
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // ── Создание записи ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedStaff || !selectedDate || !selectedTime || selectedServices.length === 0) return;

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        staffId: selectedStaff.id,
        date: selectedDate,
        startTime: selectedTime,
        serviceIds: selectedServices.map((s) => s.id),
        clientName: name,
        clientPhone: phone,
      });
      toast.success('Запись создана! Ожидайте подтверждения.');
      router.push('/bookings');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 409) {
        toast.error('Этот слот уже занят — выберите другое время');
        setStep(2);
      } else {
        toast.error(msg || 'Не удалось создать запись');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Sidebar «Ваша запись» ────────────────────────────────────────────
  const BookingSidebar = () => (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm">
      <h3 className="font-semibold text-foreground">Ваша запись</h3>
      <div className="space-y-1.5 text-muted-foreground">
        <p><span className="text-foreground font-medium">Бизнес:</span> {businessName}</p>
        {selectedStaff && (
          <p><span className="text-foreground font-medium">Мастер:</span> {selectedStaff.name}</p>
        )}
        {selectedServices.length > 0 && (
          <div>
            <span className="text-foreground font-medium">Услуги:</span>
            <ul className="ml-3 mt-0.5 space-y-0.5">
              {selectedServices.map((s) => (
                <li key={s.id}>{s.name} — {Number(s.price).toLocaleString('ru')} ₽</li>
              ))}
            </ul>
          </div>
        )}
        {selectedDate && (
          <p>
            <span className="text-foreground font-medium">Дата:</span>{' '}
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru', {
              weekday: 'short', day: 'numeric', month: 'long',
            })}
          </p>
        )}
        {selectedTime && (
          <p><span className="text-foreground font-medium">Время:</span> {selectedTime}</p>
        )}
        {totalDuration > 0 && (
          <p><span className="text-foreground font-medium">Длительность:</span> {totalDuration} мин</p>
        )}
      </div>
      {totalPrice > 0 && (
        <div className="pt-2 border-t border-border flex justify-between font-semibold text-foreground">
          <span>Итого</span>
          <span className="text-primary">{totalPrice.toLocaleString('ru')} ₽</span>
        </div>
      )}
    </div>
  );

  // ── Рендер шагов ────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-3xl font-semibold mb-6">Онлайн-запись</h1>

      <Stepper steps={STEPS} currentStep={step} className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основной контент (2 колонки на десктопе) */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Шаг 1: Выбор мастера ── */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Выберите мастера</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedStaff(s);
                      setSelectedServices([]);
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedStaff?.id === s.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarImage src={s.photoUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {s.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{s.name}</p>
                      {s.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{s.bio}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <Button
                className="mt-6"
                disabled={!selectedStaff}
                onClick={() => setStep(1)}
              >
                Далее →
              </Button>
            </div>
          )}

          {/* ── Шаг 2: Выбор услуг ── */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Выберите услуги</h2>
              {staffServices.length === 0 ? (
                <p className="text-muted-foreground">У мастера нет услуг</p>
              ) : (
                <div className="space-y-2">
                  {staffServices.map((svc) => {
                    const isSelected = !!selectedServices.find((s) => s.id === svc.id);
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-foreground">{svc.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{svc.durationMin} мин</p>
                        </div>
                        <span className="font-semibold text-primary shrink-0 ml-4">
                          {Number(svc.price).toLocaleString('ru')} ₽
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(0)}>← Назад</Button>
                <Button disabled={selectedServices.length === 0} onClick={() => setStep(2)}>
                  Далее →
                </Button>
              </div>
            </div>
          )}

          {/* ── Шаг 3: Дата и время ── */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Выберите дату</h2>
              <DayPicker
                daysCount={maxAdvanceDays}
                minDate={new Date()}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
              />

              {selectedDate && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Доступное время</h3>
                  {slotsLoading ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-9 w-16 bg-muted animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Нет доступного времени</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.map((slot) => (
                        <TimeSlot
                          key={slot}
                          time={slot}
                          state={
                            selectedTime === slot
                              ? 'selected'
                              : 'available'
                          }
                          onClick={() => setSelectedTime(slot)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>← Назад</Button>
                <Button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                >
                  Далее →
                </Button>
              </div>
            </div>
          )}

          {/* ── Шаг 4: Контакты ── */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Ваши контакты</h2>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Телефон</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>← Назад</Button>
                <Button disabled={!name.trim()} onClick={() => setStep(4)}>
                  Далее →
                </Button>
              </div>
            </div>
          )}

          {/* ── Шаг 5: Подтверждение ── */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Подтвердите запись</h2>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm max-w-md">
                <Row label="Мастер" value={selectedStaff?.name} />
                <Row
                  label="Услуги"
                  value={selectedServices.map((s) => s.name).join(', ')}
                />
                <Row
                  label="Дата"
                  value={
                    selectedDate
                      ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru', {
                          weekday: 'long', day: 'numeric', month: 'long',
                        })
                      : ''
                  }
                />
                <Row label="Время" value={selectedTime ?? ''} />
                <Row label="Длительность" value={`${totalDuration} мин`} />
                <Row label="Имя" value={name} />
                {phone && <Row label="Телефон" value={phone} />}
                <div className="pt-2 border-t border-border flex justify-between font-semibold">
                  <span>Итого</span>
                  <span className="text-primary">{totalPrice.toLocaleString('ru')} ₽</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(3)}>← Назад</Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Создаём запись...' : 'Записаться'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (показывается с шага 1+, только десктоп) */}
        {step > 0 && (
          <div className="hidden lg:block">
            <BookingSidebar />
          </div>
        )}
      </div>
    </div>
  );
}

// Вспомогательный компонент строки подтверждения
function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}
