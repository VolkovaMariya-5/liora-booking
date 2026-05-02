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
import { formatPrice } from '@/lib/constants';

// ─── Типы — соответствуют реальной форме ответа API ───────────────────────

interface StaffOption {
  id: string;
  bio?: string | null;
  photoUrl?: string | null;
  // Имя хранится в связанном User, не в Staff
  user?: { name?: string | null; avatarUrl?: string | null };
  // Prisma-поле называется services (StaffService[]), не staffServices
  services?: { service: ServiceOption }[];
}

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  duration: number; // поле называется duration, не durationMin
}

interface BookingWizardProps {
  businessSlug: string;
  businessId: string;
  businessName: string;
  businessCountry?: string | null;
  staffList: StaffOption[];
  allServices: ServiceOption[];
  maxAdvanceDays: number;
  flow: 'master' | 'service';
}

// Шаги зависят от флоу
const STEPS_MASTER  = [{ label: 'Мастер' }, { label: 'Услуги' }, { label: 'Дата и время' }, { label: 'Контакты' }, { label: 'Подтверждение' }];
const STEPS_SERVICE = [{ label: 'Услуга' }, { label: 'Мастер' }, { label: 'Дата и время' }, { label: 'Контакты' }, { label: 'Подтверждение' }];

// ─── Компонент ────────────────────────────────────────────────────────────

// BookingWizard — 5-шаговая форма онлайн-записи
// Состояние хранится в useState, данные передаются между шагами без URL
export default function BookingWizard({
  businessSlug,
  businessId,
  businessName,
  businessCountry,
  staffList,
  allServices,
  maxAdvanceDays,
  flow,
}: BookingWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const STEPS = flow === 'service' ? STEPS_SERVICE : STEPS_MASTER;

  // ── Состояние формы ──────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState<StaffOption | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState(session?.user?.name || '');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Предвыбор мастера из ?staffId= (только флоу master-first)
  useEffect(() => {
    if (flow !== 'master') return;
    const staffId = searchParams.get('staffId');
    if (staffId) {
      const found = staffList.find((s) => s.id === staffId);
      if (found) { setSelectedStaff(found); setStep(1); }
    }
  }, [searchParams, staffList, flow]);

  // Предвыбор услуги из ?serviceId= (только флоу service-first)
  useEffect(() => {
    if (flow !== 'service') return;
    const serviceId = searchParams.get('serviceId');
    if (serviceId) {
      const found = allServices.find((s) => s.id === serviceId);
      if (found) { setSelectedServices([found]); }
    }
  }, [searchParams, allServices, flow]);

  // Услуги выбранного мастера (для флоу master-first)
  const staffServices: ServiceOption[] =
    selectedStaff?.services?.map((ss) => ss.service) ?? [];

  // Мастера, которые оказывают все выбранные услуги (для флоу service-first)
  const eligibleStaff: StaffOption[] = flow === 'service'
    ? staffList.filter((s) =>
        selectedServices.every((svc) =>
          s.services?.some((ss) => ss.service.id === svc.id),
        ),
      )
    : staffList;

  // Суммарная длительность и стоимость
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
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
        setAvailableSlots(res.data?.slots ?? res.data ?? []);
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
      setSelectedTime(null);
    }
  }, [selectedDate, loadSlots]);

  // ── Переключение услуги ─────────────────────────────────────────────
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
        businessId, // обязательное поле из CreateBookingDto
        date: selectedDate,
        startTime: selectedTime,
        serviceIds: selectedServices.map((s) => s.id),
      });
      toast.success('Запись создана! Ожидайте подтверждения.');
      router.push('/bookings');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.error('Этот слот уже занят — выберите другое время');
        setStep(2);
      } else {
        toast.error(err?.response?.data?.message || 'Не удалось создать запись');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Имя мастера (из связанного user)
  const staffName = (s: StaffOption) => s.user?.name ?? '—';

  // ── Sidebar «Ваша запись» ────────────────────────────────────────────
  const BookingSidebar = () => (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm">
      <h3 className="font-semibold text-foreground">Ваша запись</h3>
      <div className="space-y-1.5 text-muted-foreground">
        <p><span className="text-foreground font-medium">Бизнес:</span> {businessName}</p>
        {selectedStaff && (
          <p><span className="text-foreground font-medium">Мастер:</span> {staffName(selectedStaff)}</p>
        )}
        {selectedServices.length > 0 && (
          <div>
            <span className="text-foreground font-medium">Услуги:</span>
            <ul className="ml-3 mt-0.5 space-y-0.5">
              {selectedServices.map((s) => (
                <li key={s.id}>{s.name} — {formatPrice(s.price, businessCountry)}</li>
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
          <span className="text-primary">{formatPrice(totalPrice, businessCountry)}</span>
        </div>
      )}
    </div>
  );

  // ── Рендер шагов ────────────────────────────────────────────────────

  // Вспомогательный рендер списка услуг (переиспользуется в обоих флоу)
  const renderServiceList = (services: ServiceOption[]) => (
    <div className="space-y-2">
      {services.map((svc) => {
        const isSelected = !!selectedServices.find((s) => s.id === svc.id);
        return (
          <button
            key={svc.id}
            type="button"
            onClick={() => toggleService(svc)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
              isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <div>
              <p className="font-medium text-foreground">{svc.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{svc.duration} мин</p>
            </div>
            <span className="font-semibold text-primary shrink-0 ml-4">
              {Number(svc.price).toLocaleString('ru')} ₽
            </span>
          </button>
        );
      })}
    </div>
  );

  // Вспомогательный рендер списка мастеров (переиспользуется в обоих флоу)
  const renderStaffList = (list: StaffOption[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {list.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => {
            setSelectedStaff(s);
            if (flow === 'master') {
              setSelectedServices([]);
              setSelectedDate(null);
              setSelectedTime(null);
            }
          }}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
            selectedStaff?.id === s.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <Avatar className="w-12 h-12 shrink-0">
            <AvatarImage src={s.photoUrl || s.user?.avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {staffName(s).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{staffName(s)}</p>
            {s.bio && <p className="text-xs text-muted-foreground line-clamp-1">{s.bio}</p>}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-3xl font-semibold mb-6">Онлайн-запись</h1>

      <Stepper steps={STEPS} currentStep={step} className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* ══ ФЛОУ: МАСТЕР → УСЛУГА ══ */}

          {/* Шаг 0 (master): Выбор мастера */}
          {flow === 'master' && step === 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Выберите мастера</h2>
              {renderStaffList(staffList)}
              <Button className="mt-6" disabled={!selectedStaff} onClick={() => setStep(1)}>
                Далее →
              </Button>
            </div>
          )}

          {/* Шаг 1 (master): Выбор услуг мастера */}
          {flow === 'master' && step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Выберите услуги</h2>
              {staffServices.length === 0
                ? <p className="text-muted-foreground">У мастера нет привязанных услуг</p>
                : renderServiceList(staffServices)
              }
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(0)}>← Назад</Button>
                <Button disabled={selectedServices.length === 0} onClick={() => setStep(2)}>Далее →</Button>
              </div>
            </div>
          )}

          {/* ══ ФЛОУ: УСЛУГА → МАСТЕР ══ */}

          {/* Шаг 0 (service): Выбор услуг из всего каталога бизнеса */}
          {flow === 'service' && step === 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Выберите услугу</h2>
              {allServices.length === 0
                ? <p className="text-muted-foreground">Услуги ещё не добавлены</p>
                : renderServiceList(allServices)
              }
              <Button
                className="mt-6"
                disabled={selectedServices.length === 0}
                onClick={() => { setSelectedStaff(null); setStep(1); }}
              >
                Далее →
              </Button>
            </div>
          )}

          {/* Шаг 1 (service): Выбор мастера из тех, кто оказывает выбранные услуги */}
          {flow === 'service' && step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Выберите мастера</h2>
              {eligibleStaff.length === 0 ? (
                <p className="text-muted-foreground">
                  Нет мастеров, которые оказывают все выбранные услуги
                </p>
              ) : (
                renderStaffList(eligibleStaff)
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(0)}>← Назад</Button>
                <Button disabled={!selectedStaff} onClick={() => setStep(2)}>Далее →</Button>
              </div>
            </div>
          )}

          {/* ── Шаг 2: Дата и время (оба флоу) ── */}
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
                    <p className="text-sm text-muted-foreground">Нет доступного времени на эту дату</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.map((slot) => (
                        <TimeSlot
                          key={slot}
                          time={slot}
                          state={selectedTime === slot ? 'selected' : 'available'}
                          onClick={() => setSelectedTime(slot)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>← Назад</Button>
                <Button disabled={!selectedDate || !selectedTime} onClick={() => setStep(3)}>
                  Далее →
                </Button>
              </div>
            </div>
          )}

          {/* ── Шаг 3: Контакты (оба флоу) ── */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Ваши контакты</h2>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Имя</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
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
                <Button disabled={!contactName.trim()} onClick={() => setStep(4)}>
                  Далее →
                </Button>
              </div>
            </div>
          )}

          {/* ── Шаг 4: Подтверждение (оба флоу) ── */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Подтвердите запись</h2>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm max-w-md">
                <Row label="Мастер" value={selectedStaff ? staffName(selectedStaff) : ''} />
                <Row label="Услуги" value={selectedServices.map((s) => s.name).join(', ')} />
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
                <Row label="Имя" value={contactName} />
                {phone && <Row label="Телефон" value={phone} />}
                <div className="pt-2 border-t border-border flex justify-between font-semibold">
                  <span>Итого</span>
                  <span className="text-primary">{formatPrice(totalPrice, businessCountry)}</span>
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

        {/* Sidebar (с шага 1+, только десктоп) */}
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
