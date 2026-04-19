'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayPickerProps {
  // Количество дней вперёд для отображения
  daysCount: number;
  // Минимальная дата (обычно сегодня)
  minDate?: Date;
  selectedDate: string | null; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
  // Дни недели без рабочего расписания мастера (0=Вс, 1=Пн, ...)
  nonWorkingDays?: number[];
}

// Формат даты "YYYY-MM-DD" без смещения по часовому поясу
function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Короткие названия дней недели
const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// DayPicker — горизонтальная прокрутка дней для выбора даты записи (шаг 3)
// Показывает daysCount дней начиная с сегодня, нерабочие дни серые
export function DayPicker({
  daysCount,
  minDate,
  selectedDate,
  onSelect,
  nonWorkingDays = [],
}: DayPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Генерируем массив дат
  const days: Date[] = [];
  const start = minDate || new Date();
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? 200 : -200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Кнопка прокрутки влево */}
      <button
        type="button"
        onClick={() => scroll('left')}
        className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="Прокрутить влево"
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Горизонтальный скролл дней — overflow-x-auto со скрытым скроллбаром */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const dateStr = toLocalDateString(day);
          const dayOfWeek = day.getDay();
          const isSelected = selectedDate === dateStr;
          const isNonWorking = nonWorkingDays.includes(dayOfWeek);
          const isToday = toLocalDateString(new Date()) === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isNonWorking}
              onClick={() => !isNonWorking && onSelect(dateStr)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center justify-center',
                'w-14 h-16 rounded-xl text-xs font-medium transition-all duration-150 border',
                // Выбранный день
                isSelected && 'bg-primary border-primary text-primary-foreground',
                // Сегодня (не выбран)
                isToday && !isSelected && 'border-primary text-primary font-semibold bg-primary/5',
                // Обычный доступный день
                !isSelected && !isToday && !isNonWorking && [
                  'bg-card border-border text-foreground',
                  'hover:border-primary hover:bg-primary/5 cursor-pointer',
                ],
                // Нерабочий день
                isNonWorking && 'bg-muted border-muted text-muted-foreground/40 cursor-not-allowed',
              )}
            >
              {/* День недели */}
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                {DAY_NAMES[dayOfWeek]}
              </span>
              {/* Число */}
              <span className="text-base leading-tight">{day.getDate()}</span>
              {/* Месяц */}
              <span className="text-[10px] opacity-70">
                {day.toLocaleDateString('ru', { month: 'short' }).replace('.', '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Кнопка прокрутки вправо */}
      <button
        type="button"
        onClick={() => scroll('right')}
        className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="Прокрутить вправо"
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
