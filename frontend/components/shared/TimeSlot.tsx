'use client';

import { cn } from '@/lib/utils';

type SlotState = 'available' | 'selected' | 'unavailable';

interface TimeSlotProps {
  time: string; // "10:00"
  state: SlotState;
  onClick?: () => void;
}

// TimeSlot — кнопка временного слота в форме записи (шаг 3)
// Три состояния: доступен, выбран, занят — 1в1 дизайн из референса
export function TimeSlot({ time, state, onClick }: TimeSlotProps) {
  const isAvailable = state === 'available';
  const isSelected = state === 'selected';
  const isUnavailable = state === 'unavailable';

  return (
    <button
      type="button"
      disabled={isUnavailable}
      onClick={isAvailable ? onClick : undefined}
      className={cn(
        'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border select-none',
        // Доступный слот — белый фон, фиолетовая граница при hover
        isAvailable && [
          'bg-card border-border text-foreground',
          'hover:border-primary hover:text-primary hover:bg-primary/5',
          'cursor-pointer',
        ],
        // Выбранный слот — фиолетовый фон (primary)
        isSelected && [
          'bg-primary border-primary text-primary-foreground',
          'cursor-pointer ring-2 ring-primary ring-offset-1',
        ],
        // Занятый слот — серый, зачёркнутый, недоступный
        isUnavailable && [
          'bg-muted border-muted text-muted-foreground/50',
          'cursor-not-allowed line-through',
        ],
      )}
    >
      {time}
    </button>
  );
}
